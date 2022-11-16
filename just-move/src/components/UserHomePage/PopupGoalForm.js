//import { functions } from '../firebase/firebase';
import {useState, useRef } from "react";
import React from 'react';
import "./PopupGoalForm.css"
import IconButton from 'rsuite/IconButton';
import PlusIcon from '@rsuite/icons/Plus';
import CloseIcon from '@rsuite/icons/Close';
import { nanoid } from 'nanoid';
import { saveAddGoal } from "./saving";
import Animation from 'rsuite/Animation';

function PopupGoalForm(props) {

  const startDate = useRef(null);
  const goalRef = useRef(null);
  const intrinsicRef = useRef(null);
  const extrinsicRef = useRef(null);
  const reminderDate = useRef(null);
  const mostRecentDate = useRef(null);

  const handleGoalsChange = (e) => {
    e.preventDefault();
    const goalName = e.target.getAttribute("name");
    const goalValue = e.target.value;
    const newGoalData = { ...props.addGoalData };
    newGoalData[goalName] = goalValue;
    props.setGoalData(newGoalData);
  }

  const handleAddNewGoal = (e) => {
    e.preventDefault();

    const newGoal = {
      id: nanoid(),
      startDate: props.addGoalData.startDate,
      goal: props.addGoalData.goal,
      intrinsicMotivation: props.addGoalData.intrinsicMotivation,
      extrinsicMotivation: props.addGoalData.extrinsicMotivation,
      progress: "progress",
      reminderDate: props.addGoalData.reminderDate,
      mostRecentDate: props.addGoalData.mostRecentDate,
      category: [],
    }
    console.log(newGoal);
    props.setGoalList(current => [...current,props.addGoalData.goal]);

    const newGoals = [...props.goals, newGoal];
    props.setGoals(newGoals);

    goalRef.current.value = "";
    intrinsicRef.current.value = "";
    extrinsicRef.current.value = "";
    reminderDate.current.value = "";

    saveAddGoal(newGoal).catch(function (error) {
      props.startModal(error.toString(), "Error Adding Data");
      // Should we attempt to undo the change?
    });
  }

  const handleCloseForm = (e) => {
    e.preventDefault();
    props.setPopupBtnTrigger(false);
  }

  return (props.trigger) ? (
    <div className="popup">
      <Animation.Bounce in={true}>
      <div className="popup-inner" style={{color: "#6231a3"}}>
        <form onSubmit={handleAddNewGoal} id="popup-form">
          <h2>Let's Create a Goal!</h2>
          <br></br>
          <div className="form-group">
            <h3>
              Goal:
            </h3>
            <input
              type="input"
              name="goal"
              placeholder="Enter a goal..."
              className="form-control"
              onChange={handleGoalsChange}
              ref={goalRef}
              style={{ visibility: `visible`, animation: `fadeInLeft` }}
            />
          </div>
          <br></br>
          <div className="form-group">
            <h3>
              Intrinsic Goal:
            </h3>
            <input
              type="input"
              name="intrinsicMotivation"
              placeholder="Enter your intrinsic motivation for this goal..."
              className="form-control"
              onChange={handleGoalsChange}
              ref={intrinsicRef}
            />
          </div>
          <br></br>
          <div className="form-group">
            <h3>
              Extrinsic Goal:
            </h3>
            <input
              type="input"
              name="extrinsicMotivation"
              placeholder="Enter your extrinsic motivation for this goal..."
              className="form-control"
              onChange={handleGoalsChange}
              ref={extrinsicRef}
            />
          </div>
          <br></br>
          <div className="form-group">
            <h3>
              Reminder Date:
            </h3>
            <input
              type="input"
              name="reminderDate"
              placeholder="Enter the date on which you would like to be reminded about this goal..."
              className="form-control"
              onChange={handleGoalsChange}
              ref={reminderDate}
            />
          </div>
          <br></br>
          <br></br>
          <IconButton type="submit"
            icon={<PlusIcon />}
            appearance="primary"
            color="violet"
            id="add-goal-btn">
          </IconButton>
        </form>
        <IconButton
          icon={<CloseIcon />}
          appearance="primary"
          color="red"
          id="close-btn"
          onClick={handleCloseForm}>
        </IconButton>
      </div>
      </Animation.Bounce>
    </div>
  ) : "";
}

export default PopupGoalForm
