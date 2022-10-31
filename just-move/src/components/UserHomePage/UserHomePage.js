import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { Goal } from "./Goal";
import { nanoid } from 'nanoid';
import IconButton from 'rsuite/IconButton';
import PlusIcon from '@rsuite/icons/Plus';
import { loadData, saveDelGoal, saveAddGoal, hasOutstandingWrites } from "./saving"
import { auth } from '../firebase/firebase';
import { LoadingScreen } from "../Loading";
import { useBeforeunload } from 'react-beforeunload';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';

export function UserHomePage() {

  const goalRef = useRef(null);
  const intrinsicRef = useRef(null);
  const extrinsicRef = useRef(null);

  const [goals, setGoals] = useState([]);
  const [errModal, setErrModal] = useState(null);

  const [addGoalData, setGoalData] = useState({
    goal: "",
    intrinsicMotivation: "",
    extrinsicMotivation: "",
    progress: "",
  });

  const [hasLoaded, setHasLoaded] = useState(false);

  const handleGoalsChange = (e) => {
    e.preventDefault();
    const goalName = e.target.getAttribute("name");
    const goalValue = e.target.value;
    const newGoalData = { ...addGoalData };
    newGoalData[goalName] = goalValue;
    setGoalData(newGoalData);
  }

  const handleAddNewGoal = (e) => {
    e.preventDefault();

    const newGoal = {
      id: nanoid(),
      goal: addGoalData.goal,
      intrinsicMotivation: addGoalData.intrinsicMotivation,
      extrinsicMotivation: addGoalData.extrinsicMotivation,
      progress: " ",
    }

    const newGoals = [...goals, newGoal];
    setGoals(newGoals);

    goalRef.current.value = "";
    intrinsicRef.current.value = "";
    extrinsicRef.current.value = "";
    saveAddGoal(newGoal).catch(function (error) {
      startModal(error.toString(), "Error Adding Data");
      // Should we attempt to undo the change?
    });
  }

  const handleDeleteGoal = (goalId) => {
    const newGoals = [...goals];

    const index = goals.findIndex((goal) => goal.id === goalId);

    newGoals.splice(index, 1);

    setGoals(newGoals);
    saveDelGoal(goalId).catch(function (error) {
      startModal(error.toString(), "Error Deleting Data");
    });
  }

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

  return (<div>
    <div id="userHomePage-root">
      {ldSc}
      <button className="btn btn-danger float-end m-2" onClick={handleLogout}>Log Out</button>
      <h1>Welcome to your home page!</h1>
      <form onSubmit={handleAddNewGoal}>
        <h2>Let's Create a Goal!</h2>
        <div className="form-group">
          <label>
            Goal:
          </label>
          <input
            type="input"
            name="goal"
            placeholder="Enter a goal..."
            ref={goalRef}
            className="form-control"
            onChange={handleGoalsChange}
          />
        </div>
        <div className="form-group">
          <label>
            Intrinsic Goal:
          </label>
          <input
            type="input"
            name="intrinsicMotivation"
            placeholder="Enter your intrinsic motivation for this goal..."
            ref={intrinsicRef}
            className="form-control"
            onChange={handleGoalsChange}
          />
        </div>
        <div className="form-group">
          <label>
            Extrinsic Goal:
          </label>
          <input
            type="input"
            name="extrinsicMotivation"
            placeholder="Enter your extrinsic motivation for this goal..."
            ref={extrinsicRef}
            className="form-control"
            onChange={handleGoalsChange}
          />
        </div>
        <IconButton type="submit" icon={<PlusIcon />} appearance="primary" color="green">Create</IconButton>
      </form>
      <table id="goals-table" className="table mt-5">
        <thead>
          <tr>
            <th scope="col">Goal</th>
            <th scope="col">Intrinsic Motivations</th>
            <th scope="col">Extrinsic Motivations</th>
            <th scope="col">Progress Bar</th>
          </tr>
        </thead>
        <tbody id="goals-table-body">
          {goals.map((newGoal) => (
            <Goal props={newGoal} key={newGoal.id} handleDeleteGoal={handleDeleteGoal} />
          ))}
        </tbody>
      </table>
    </div>
    {modal}
  </div>
  )
}
