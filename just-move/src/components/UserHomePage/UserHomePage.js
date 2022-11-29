import { auth } from '../firebase/firebase';
import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { Goal } from "./Goal";
import { SubGoal } from "./SubGoal";
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

const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${month}-${day}-${year}`;

function sortHelper(property) {
  return (a, b) => a[property] - b[property];
}

function progressSorter(a, b) {
  if (a.progress.value === undefined && b.progress.value === undefined) {
    return 0;
  } else if (a.progress.value === undefined) {
    return -1;
  } else if (b.progress.value === undefined) {
    return 1;
  } else {
    return (a.progress.value / a.progress.target) - (b.progress.value / b.progress.target);
  }
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

export function UserHomePage() {
  const goalRef = useRef(null);
  const subgoalRef = useRef(null);

  const [goals, setGoals] = useState([]);
  const [errModal, setErrModal] = useState(null);
  const [GoalList, setGoalList] = useState([]);
  const [categoryList, setCategoryList] = useState(['Fitness', 'Work', 'Hobby'].map(
    item => ({
      label: item,
      value: item,
    })
  ));
  const [filters, setFilters] = useState([]);
  const [sortFunc, setSortFunc] = useState(0);

  const padding = "100px";
  const tableColumnFontSize = "20px";
  const homepageTextColor = "#6231a3";
  const homepageDarkTextColor = "#b12ebf";

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

  const handleEditGoal = (goalId, start, goal, intrinsic, extrinsic, priority, reminder, category, subgoal, completed) => {
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

  const ldSc = hasLoaded ? null : <LoadingScreen />;
  const modal = errModal ? (<Modal show={true} onHide={() => setErrModal(null)} centered size="md">
    <Modal.Header closeButton><Modal.Title>{errModal.title}</Modal.Title></Modal.Header>
    <Modal.Body><p>{errModal.msg}</p></Modal.Body>
  </Modal >) : null;

  const textColor = darkMode ? homepageDarkTextColor : homepageTextColor;

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
            <Animation.Slide in={true} placement={React.useState('left')}>
              <div style={{ position: "absolute", left: padding, zIndex: 1 }}>
                <button className="btn btn-danger m-1" style={{
                  backgroundColor: "#cc00cc",
                  border: "none"
                }} onClick={() => setNavBar(true)}><i class="bi bi-filter"></i></button>
              </div>
            </Animation.Slide>
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
          <br></br>
          <div style={{ textAlign: "center" }}>
            <Animation.Slide in={true} placement={React.useState('left')}>
              <h1
                className="display-1 text-center"
                style={{ color: textColor }}>
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
            setGoalList={(e) => {
              setGoalList(e);
              setPopupBtn(false);
            }}
            startModal={startModal}
            sortFunc={getSortFunc(sortFunc)}
            darkMode={darkMode}
          >
          </PopupGoalForm>
          <table id="goals-table" className="table mt-5">
            <thead>
              <Animation.Bounce in={true}>
                <tr style={{ fontSize: tableColumnFontSize, color: textColor }}>
                  <th sope="col">Start Date{
                  }</th>
                  <th scope="col">Goal</th>
                  <th scope="col">Intrinsic Motivations</th>
                  <th scope="col">Extrinsic Motivations</th>
                  <th scope="col">Priority{
                  }</th>
                  <th scope="col">Reminder Date</th>
                  <th scope="col">Most Recent Date</th>
                  <th scope="col" onClick={() => changeSorting(2)}>Progress Bar{
                    getArrowIndic(2)
                  }</th>
                  <th scope="col">Subtasks</th>
                  <th scope="col">
                    Categories
                  </th>
                </tr>
              </Animation.Bounce>
            </thead>
            <tbody id="goals-table-body">
              {filteredGoalList.map((newGoal) => (
                <Goal props={newGoal} key={newGoal.id} handleDeleteGoal={handleDeleteGoal} handleEditGoal={handleEditGoal} categoryList={categoryList} updateGoalList={updateGoalList} darkMode={darkMode} />
              ))}
            </tbody>
          </table>

        </div >
        {modal}
      </div >
    </div>
  );
}
