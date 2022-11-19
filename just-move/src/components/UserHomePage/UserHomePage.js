import {auth } from '../firebase/firebase';
import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { Goal } from "./Goal";
import { SubGoal } from "./SubGoal";
import PopupGoalForm from "./PopupGoalForm";
import Button from 'rsuite/Button';
import Animation from 'rsuite/Animation';
import { loadData, saveAddGoal, saveDelGoal, hasOutstandingWrites } from "./saving";
import { LoadingScreen } from "../Loading";
import { useBeforeunload } from 'react-beforeunload';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import IconButton from 'rsuite/IconButton';
import PlusIcon from '@rsuite/icons/Plus';

import { TagPicker } from 'rsuite';


const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${month}-${day}-${year}`;

export function UserHomePage() {
  const goalRef = useRef(null);
  const subgoalRef= useRef(null);

  const [goals, setGoals] = useState([]);
  const [errModal, setErrModal] = useState(null);
  const [subgoals, setsubGoals] = useState([]);
  const [GoalList, setGoalList] = useState([]);
  const [categoryList, setCategoryList] = useState(['Fitness', 'Work', 'Hobby'].map(
    item => ({
      label: item,
      value: item,
    })
  ));
  const [filters, setFilters] = useState([]);

  const [addGoalData, setGoalData] = useState({
    startDate: currentDate,
    goal: "",
    intrinsicMotivation: "",
    extrinsicMotivation: "",
    reminderDate: "",
    mostRecentDate: currentDate,
    category: [],
    subgoal: [],
  });


  const [popupBtn, setPopupBtn] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleDeleteGoal = (goalId) => {
    const newGoals = [...goals];

    const index = goals.findIndex((goal) => goal.id === goalId);

    newGoals.splice(index, 1);

    setGoals(newGoals);
    saveDelGoal(goalId).catch(function (error) {
      startModal(error.toString(), "Error Deleting Data");
    });
  }

  const handleEditGoal = (goalId, start, goal, intrinsic, extrinsic, reminder, category, subgoal) => {
    const newGoals = [...goals];
    const index = goals.findIndex((goal) => goal.id === goalId);
    newGoals[index].startDate = start;
    newGoals[index].goal = goal;
    newGoals[index].intrinsicMotivation = intrinsic;
    newGoals[index].extrinsicMotivation = extrinsic;
    newGoals[index].reminderDate = reminder;
    newGoals[index].category = category;
    newGoals[index].subgoal = subgoal;

    setGoals(newGoals);
    saveAddGoal(goals[index]).catch(function (error) {
      startModal(error.toString(), "Error Editing Data");
    });
  }

  const updateGoalList = (category) => {
    categoryList.push({label: category, value: category});
  }

  const filteredGoalList = (filters == null || filters.length == 0)
        ? goals
        : goals.filter( goal => {
          for (const category of goal.category){
            if (filters.includes(category)) {
              return true;
            }
          }
          return false;
        });

  const startModal = (msg, title) => {
    setErrModal({ msg: msg, title: title });
  }

  const navigate = useNavigate();

  async function handleLogout() {
    await auth.signOut()
    navigate("/login");
  }

  useEffect(function () {
    const unsub = auth.onAuthStateChanged(function () {
      loadData().then(function (data) {
        setGoals(data);
        setHasLoaded(true);
        unsub();
      }).catch(function (error) {
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

  return (
    <div>
      {ldSc}
      <div>
        <button className="btn btn-danger m-2" style={{ position: "absolute", right: 0 }} onClick={handleLogout}>Log Out</button>
        <br></br>
        <div style={{ textAlign: "center" }}>
          <Animation.Slide in={true} placement={React.useState('left')}>
            <h1
              style={{ color: "#38ACEC" }}>
              Just Move
            </h1>
          </Animation.Slide>
          <br></br>
          <Animation.Slide in={true} placement={React.useState('right')}>
            <Button
              onClick={() => setPopupBtn(true)}
              color='green'
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
          GoalList = {GoalList}
          setGoalList = {setGoalList}
          startModal={startModal}
        >
        </PopupGoalForm>
        <table id="goals-table" className="table mt-5">
          <Animation.Bounce in={true}>
            <thead>
              <tr>
                <th sope="col">Start Date</th>
                <th scope="col">Goal</th>
                <th scope="col">Intrinsic Motivations</th>
                <th scope="col">Extrinsic Motivations</th>
                <th scope="col">Reminder Date</th>
                <th scope="col">Most Recent Date</th>
                <th scope="col">Progress Bar</th>
                <th scope="col">Subtasks</th>
                <th scope="col">
                  Categories
                  <TagPicker
                    data={categoryList}
                    style={{ width: 300 }}
                    menuStyle={{ width: 300 }}
                    onChange={(value) => {
                      setFilters(value);
                    }}
                  />
                </th>
              </tr>
            </thead>

          </Animation.Bounce>
          <tbody id="goals-table-body">
            {filteredGoalList.map((newGoal) => (
              <Goal props={newGoal} key={newGoal.id} handleDeleteGoal={handleDeleteGoal} handleEditGoal={handleEditGoal} categoryList={categoryList} updateGoalList={updateGoalList}/>
            ))}
          </tbody>
        </table>

      </div>
      {modal}
    </div >
  );
}
