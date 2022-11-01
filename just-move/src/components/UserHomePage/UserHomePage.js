import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { Goal } from "./Goal";
import PopupGoalForm from "./PopupGoalForm";
import Button from 'rsuite/Button';
import Animation from 'rsuite/Animation'
import { loadData, saveDelGoal, hasOutstandingWrites } from "./saving"
import { auth } from '../firebase/firebase';
import { LoadingScreen } from "../Loading";
import { useBeforeunload } from 'react-beforeunload';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';

export function UserHomePage() {

  const goalRef = useRef(null);

  const [goals, setGoals] = useState([]);
  const [errModal, setErrModal] = useState(null);

  const [addGoalData, setGoalData] = useState({
    goal: "",
    intrinsicMotivation: "",
    extrinsicMotivation: "",
    progress: "",
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
    {ldSc}
    <div>
      <button className="btn btn-danger float-end m-2" onClick={handleLogout}>Log Out</button>
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
      <PopupGoalForm trigger={popupBtn}
        setPopupBtnTrigger={setPopupBtn}
        goalRef={goalRef}
        addGoalData={addGoalData}
        setGoalData={setGoalData}
        goals={goals}
        setGoals={setGoals}>
      </PopupGoalForm>
      <table id="goals-table" className="table mt-5">
        <Animation.Bounce in={true}>
          <thead>
            <tr>
              <th scope="col">Goal</th>
              <th scope="col">Intrinsic Motivations</th>
              <th scope="col">Extrinsic Motivations</th>
              <th scope="col">Progress Bar</th>
            </tr>
          </thead>
        </Animation.Bounce>
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
