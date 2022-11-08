import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { Goal } from "./Goal";
import { SubGoal } from "./SubGoal";
import PopupGoalForm from "./PopupGoalForm";
import Button from 'rsuite/Button';
import Animation from 'rsuite/Animation';
import { loadData, saveAddGoal, saveDelGoal, hasOutstandingWrites } from "./saving";
import { auth } from '../firebase/firebase';
import { LoadingScreen } from "../Loading";
import { useBeforeunload } from 'react-beforeunload';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import IconButton from 'rsuite/IconButton';
import PlusIcon from '@rsuite/icons/Plus';


export function UserHomePage() {

  const goalRef = useRef(null);
  const subgoalRef= useRef(null);

  const [goals, setGoals] = useState([]);
  const [errModal, setErrModal] = useState(null);
  const [subgoals, setsubGoals] = useState([]);
  const [GoalList,setGoalList] = useState([]);

  const [addGoalData, setGoalData] = useState({
    goal: "",
    intrinsicMotivation: "",
    extrinsicMotivation: "",
    subgoal: "",
    progress: {value:1, target:5},
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

  const handleEditGoal = (goalId, goal, intrinsic, extrinsic) => {
    const newGoals = [...goals];
    const index = goals.findIndex((goal) => goal.id === goalId);
    newGoals[index].goal = goal;
    newGoals[index].intrinsicMotivation = intrinsic;
    newGoals[index].extrinsicMotivation = extrinsic;

    setGoals(newGoals);
    saveAddGoal(goals[index]).catch(function (error) {
      startModal(error.toString(), "Error Editing Data");
    });
  }

  const handlesubGoal = (goalId, subgoal) => {
    const newGoals = [...goals];
    const index = goals.findIndex((goal) => goal.id === goalId);
    newGoals[index].subgoal = subgoal;

    setGoals(newGoals);
    saveAddGoal(goals[index]).catch(function (error) {
      startModal(error.toString(), "Error Editing Data");
    });
  }
  // const handlesubGoalsChange = (e) => {
  //   e.preventDefault();
  //   const subgoalName = e.target.getAttribute("name");
  //   const subgoalValue = e.target.value;
  //   const newsubGoalData = { ...addsubGoalData };
  //   newsubGoalData[subgoalName] = subgoalValue;
  //   setsubGoalData(newsubGoalData);
  // }

  // const handleAddNewSubGoal = (e) => {
  //   e.preventDefault();

  //   const newsubGoal = {
  //     id: nanoid(),
  //     subgoal: addsubGoalData.subgoal,
  //     progress: " ",
  //   }

  //   const newsubGoals = [...subgoals, newsubGoal];
  //   if(subgoalRef.current.value != ""){
  //     setsubGoals(newsubGoals);
  //   }
  //   subgoalRef.current.value = "";

  // }

  // const handleDeletesubGoal = (subgoalId) => {
  //   const newsubGoals = [...subgoals];

  //   const index = subgoals.findIndex((subgoal)=> subgoal.id === subgoalId);

  //   newsubGoals.splice(index, 1);

  //   setsubGoals(newsubGoals);

  //   GoalList.splice(index, 1);

  // }

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
                <th scope="col">Goal</th>
                <th scope="col">Intrinsic Motivations</th>
                <th scope="col">Extrinsic Motivations</th>
                <th scope="col">Progress Bar</th>
                <th scope="col">SubTasks</th>
              </tr>
            </thead>

          </Animation.Bounce>
          <tbody id="goals-table-body">
            {goals.map((newGoal) => (
              <Goal props={newGoal} key={newGoal.id} handleDeleteGoal={handleDeleteGoal} handleEditGoal={handleEditGoal} handlesubGoal={handlesubGoal} />
            ))}
          </tbody>
        </table>
        {/* <form onSubmit={handleAddNewSubGoal}>
          <label>
            SubGoal:
          </label>
          <input
            type="input"
            name="subgoal"
            placeholder="Enter your tasks for this goal..."
            ref={subgoalRef}
            className="form-control"
            onChange={handlesubGoalsChange}
          /> */}

          {/* <IconButton type="submit" icon={<PlusIcon />} appearance="primary" color="cyan">Create</IconButton>
        </form> */}

        {/* <table id="subgoals-table" className="table mt-5">
          <thead>
            <tr>
              <th scope="col">Tasks</th>
              <th scope="col">Goal</th>
              <th scope="col">Progress</th>
            </tr>

          </thead>

          <tbody id="subgoals-table-body">
            {subgoals.map((newsubGoal)=> (
              <SubGoal props={newsubGoal} key={newsubGoal.id} list={GoalList} handleDeletesubGoal={handleDeletesubGoal}/>
            ))}
          </tbody>
        </table> */}

      </div>
      {modal}
    </div >
  );
}