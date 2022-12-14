import { auth } from '../firebase/firebase';
import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { Goal } from "./Goal";
import { Stats } from './Stats';
import PopupGoalForm from "./PopupGoalForm";
import SideNavBar from "./SideNavBar";
import Button from 'rsuite/Button';
import Animation from 'rsuite/Animation';
import { loadData, saveAddGoal, saveDelGoal, hasOutstandingWrites, saveSetting } from "./saving";
import { LoadingScreen } from "../Loading";
import { useBeforeunload } from 'react-beforeunload';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import IconButton from 'rsuite/IconButton';
import PlusIcon from '@rsuite/icons/Plus';
import "./UserHomePage.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { FlexboxGrid } from 'rsuite';

const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${year}-${month}-${day}`;

function sortHelper(property) {
  return (a, b) => a[property] - b[property];
}

function progressSorter(a, b) {
  if (a.subgoal.length === 0 && b.subgoal.length === 0) {
    return 0;
  } else if (a.subgoal.length === 0) {
    return -1;
  } else if (b.subgoal.length === 0) {
    return 1;
  }
  const completed1 = a.subgoal.reduce((acc, obj) => {
    if (obj.completed) {
      return acc + 1;
    }
    return acc;
  }, 0);
  const completed2 = b.subgoal.reduce((acc, obj) => {
    if (obj.completed) {
      return acc + 1;
    }
    return acc;
  }, 0);
  return (completed1 / a.subgoal.length) - (completed2 / b.subgoal.length);
}

function sortReverser(f) {
  return (a, b) => { return f(b, a) };
}

const sortFuncs = [sortHelper("added"), sortHelper("priority"), progressSorter];

function getSortFunc(i) {
  if (i >= 32) {
    return sortReverser(sortFuncs[i - 32]);
  }
  return sortFuncs[i];
}

export const homepageTextColor = "#6231a3";
export const homepageDarkTextColor = "#b12ebf";

export function UserHomePage() {
  const goalRef = useRef(null);
  const subgoalRef = useRef(null);

  const [goals, setGoals] = useState([]);
  const [errModal, setErrModal] = useState(null);
  const [GoalList, setGoalList] = useState([]);
  const categoryList = ['Fitness', 'Work', 'Hobby', 'Social', 'Long-term', 'Short-term'].map(
    item => ({
      label: item,
      value: item,
    })
  );
  const [filters, setFilters] = useState([]);
  const [sortFunc, setSortFunc] = useState(0);

  const padding = "100px";
  const tableColumnFontSize = "20px";

  const [addGoalData, setGoalData] = useState({
    startDate: currentDate,
    goal: "",
    intrinsicMotivation: "",
    extrinsicMotivation: "",
    priority: 0,
    added: 0,
    reminderDate: "",
    mostRecentDate: currentDate,
    category: [],
    subgoal: [],
    completed: false,
  });


  const [popupBtn, setPopupBtn] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [navBar, setNavBar] = useState(false);
  const [statsBar, setStatsBar] = useState(true);

  const closeNavBar = () => { setNavBar(false) };

  const handleDeleteGoal = (goalId) => {
    const newGoals = [...goals];

    const index = goals.findIndex((goal) => goal.id === goalId);

    newGoals.splice(index, 1);

    setGoals(newGoals);
    saveDelGoal(goalId).catch(function (error) {
      startModal(error.toString(), "Error Deleting Data");
    });
  }

  const handleEditGoal = (goalId, start, goal, intrinsic, extrinsic, priority, reminder, category, subgoal, completed, recent) => {
    const newGoals = [...goals];
    const index = goals.findIndex((goal) => goal.id === goalId);
    newGoals[index].startDate = start;
    newGoals[index].goal = goal;
    newGoals[index].intrinsicMotivation = intrinsic;
    newGoals[index].extrinsicMotivation = extrinsic;
    newGoals[index].reminderDate = reminder;
    newGoals[index].category = category;
    newGoals[index].priority = parseInt(priority);
    newGoals[index].subgoal = subgoal;
    newGoals[index].completed = completed;
    newGoals[index].mostRecentDate = recent;

    newGoals.sort(getSortFunc(sortFunc));
    setGoals(newGoals);
    saveAddGoal(goals[index]).catch(function (error) {
      startModal(error.toString(), "Error Editing Data");
    });
  }

  const updateGoalList = (category) => {
    categoryList.push({ label: category, value: category });
  }

  const filteredGoalList = (filters === null || filters.length === 0)
    ? goals
    : goals.filter(goal => {
      for (const category of goal.category) {
        if (filters.includes(category)) {
          return true;
        }
      }
      return false;
    });

  const changeSorting = (newSortFunc) => {
    if (newSortFunc === sortFunc) {
      newSortFunc ^= 32;
    }
    if (hasLoaded) {
      saveSetting("sorting", newSortFunc);
    }
    const newGoals = goals;
    newGoals.sort(getSortFunc(newSortFunc));
    setSortFunc(newSortFunc);
    setGoals(newGoals);
  }

  const startModal = (msg, title) => {
    setErrModal({ msg: msg, title: title });
  }

  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  }

  const getArrowIndic = (i) => {
    if (i === sortFunc) {
      return " \u2193";
    } else if (i === (sortFunc ^ 32)) {
      return " \u2191";
    }
    return "";
  }

  useEffect(function () {
    const unsub = auth.onAuthStateChanged(function () {
      loadData().then(function (data) {
        if (data.sorting !== undefined) {
          changeSorting(data.sorting);
        }
        if (data.darkMode !== undefined) {
          setDarkMode(data.darkMode);
        }
        data.goals.sort(getSortFunc(sortFunc));
        setGoals(data.goals);
        setHasLoaded(true);
        unsub();
      }).catch(function (error) {
        console.log(error);
        startModal(error.toString(), "Error Loading Data");
      });
    });
  }, []);

  useBeforeunload(() => {
    if (hasOutstandingWrites()) {
      // IDEA: Try to emergency save offline. Attempt sync on next login.
      // This will fail for multiple users, and requires Last-Modified tracking.
      return "Your changes have not yet been saved!\nGo online to fix.";
    }
  });

  const ldSc = hasLoaded ? (statsBar ? <Stats goals={goals} darkMode={darkMode} /> : "") : <LoadingScreen />;
  const modal = errModal ? (<Modal show={true} onHide={() => setErrModal(null)} centered size="md">
    <Modal.Header closeButton><Modal.Title>{errModal.title}</Modal.Title></Modal.Header>
    <Modal.Body><p>{errModal.msg}</p></Modal.Body>
  </Modal >) : null;

  return (
    <div style={{ display: "flex", flexBasis: "auto" }} className={darkMode ? "dark-mode" : ""}>
      <SideNavBar
        categoryList={categoryList}
        setFilters={setFilters}
        changeSorting={changeSorting}
        getArrowIndic={getArrowIndic}
        startDateSortIndic={0}
        startDateArrowIndic={0}
        prioritySortIndic={33}
        prioritySortArrowIndic={1}
        darkMode={darkMode}
        trigger={navBar}
        closeNavBar={closeNavBar}
      >
      </SideNavBar>
      <div style={{
        height: "100vh", width: "100vw",
        paddingTop: "75px", paddingLeft: padding, paddingRight: padding,
        paddingBottom: padding
      }}>
        {ldSc}
        <div>
          <div style={{ display: navBar ? "none" : "inline" }}>
            <div style={{ position: "absolute", left: padding, zIndex: 1 }}>
              <Animation.Slide in={true} placement={React.useState('left')}>
                <button className="btn btn-danger m-1" style={{
                  backgroundColor: "#cc00cc",
                  border: "none"
                }} onClick={() => setNavBar(true)}><i className="bi bi-filter"></i></button>
              </Animation.Slide>
              <Animation.Slide in={true} placement={React.useState('left')}>
                <button className="btn btn-danger m-1" style={{
                  backgroundColor: "#cc00cc",
                  border: "none",
                  display: goals.length ? "inline" : "none"
                }} onClick={() => setStatsBar(!statsBar)}><i className="bi bi-person-lines-fill"></i></button>
              </Animation.Slide>
            </div>
          </div>
          <div>
            <Animation.Slide in={true} placement={React.useState('right')}>
              <div style={{ position: "absolute", right: padding, zIndex: 1 }}>
                <button className="btn btn-danger m-1" style={{
                  backgroundColor: "#cc00cc",
                  border: "none"
                }} onClick={handleLogout}>Log Out</button>
                <button className="btn m-1" style={{
                  backgroundColor: "#cc00cc",
                  border: "none",
                  color: "white"
                }} onClick={() => { saveSetting("darkMode", !darkMode); setDarkMode(!darkMode) }}><i className={darkMode ? "icon bi-moon-fill" : "icon bi-brightness-high"}></i>
                </button>
              </div>
            </Animation.Slide>
          </div>
        </div>
        <br></br>
        <div style={{ textAlign: "center" }}>
          <Animation.Slide in={true} placement={React.useState('left')}>
            <h1
              className="display-1 text-center"
              style={{ color: !darkMode ? homepageTextColor : homepageDarkTextColor }}>
              Just Move
            </h1>
          </Animation.Slide>
          <br></br>
          <Animation.Slide in={true} placement={React.useState('right')}>
            <Button
              onClick={() => setPopupBtn(true)}
              color="violet"
              appearance='primary'
              size='lg'
              style={{ fontSize: "20px" }}>
              Add a new goal!
            </Button>
          </Animation.Slide>
        </div>
        <PopupGoalForm
          trigger={popupBtn}
          setPopupBtnTrigger={setPopupBtn}
          goalRef={goalRef}
          addGoalData={addGoalData}
          setGoalData={setGoalData}
          goals={goals}
          setGoals={setGoals}
          GoalList={GoalList}
          setGoalList={(e) => { setGoalList(e); setPopupBtn(false) }}
          startModal={startModal}
          sortFunc={getSortFunc(sortFunc)}
          darkMode={darkMode}
        >
        </PopupGoalForm>
        <Animation.Bounce in={true}>
          <FlexboxGrid style={{ fontSize: tableColumnFontSize, color: !darkMode ? homepageTextColor : homepageDarkTextColor }}>
            <FlexboxGrid.Item colspan={3} className="th-hoverable" onClick={() => changeSorting(0)}>Start Date{
              getArrowIndic(0)
            }</FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={4} scope="col">Goal</FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={3} scope="col" className="th-hoverable" onClick={() => changeSorting(33)}>Priority{
              getArrowIndic(1)
            }</FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={6} scope="col" className="th-hoverable" onClick={() => changeSorting(2)}>Progress Bar{
              getArrowIndic(2)
            }</FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={5} scope="col">
              Categories
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Animation.Bounce>
        <div id="goals-body">
          {filteredGoalList.map((newGoal) => (
            <Goal props={newGoal} key={newGoal.id} handleDeleteGoal={handleDeleteGoal} handleEditGoal={handleEditGoal} categoryList={categoryList} updateGoalList={updateGoalList} darkMode={darkMode} />
          ))}
        </div>
      </div >
    </div >
  );
}
