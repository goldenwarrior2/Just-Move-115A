import { useState, useRef } from "react";
import React from 'react';
import "./PopupGoalForm.css";
import IconButton from 'rsuite/IconButton';
import PlusIcon from '@rsuite/icons/Plus';
import CloseIcon from '@rsuite/icons/Close';
import { nanoid } from 'nanoid';
import { saveAddGoal } from "./saving";
import Animation from 'rsuite/Animation';
import { PrioritySelect } from "./PrioritySelect";

    const date = new Date();
    let day = date.getDate() + 1;
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let tommorowDate = `${year}-${month}-${day}`;

function PopupGoalForm(props) {

  const startDate = useRef(null);
  const goalRef = useRef(null);
  const intrinsicRef = useRef(null);
  const extrinsicRef = useRef(null);
  const reminderDate = useRef(null);
  const mostRecentDate = useRef(null);
  const [priority, setPriority] = useState("0");

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
      priority: parseInt(priority),
      added: Math.floor(Date.now() / 1000),
      reminderDate: props.addGoalData.reminderDate,
      mostRecentDate: props.addGoalData.mostRecentDate,
      category: [],
      subgoal: [],
      completed: false,
    }
    console.log(newGoal);
    props.setGoalList(current => [...current, props.addGoalData.goal]);

    const newGoals = [...props.goals, newGoal];
    newGoals.sort(props.sortFunc);
    props.setGoals(newGoals);

    goalRef.current.value = "";
    intrinsicRef.current.value = "";
    extrinsicRef.current.value = "";
    reminderDate.current.value = "";
    setPriority("0");

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
        <div className={props.darkMode ? "popup-inner popup-dark" : "popup-inner"}>
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
                className={props.darkMode ? "form-control form-dark" : "form-control"}
                onChange={handleGoalsChange}
                ref={goalRef}
                style={{ visibility: `visible`, animation: `fadeInLeft` }}
                required={true}
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
                className={props.darkMode ? "form-control form-dark" : "form-control"}
                onChange={handleGoalsChange}
                ref={intrinsicRef}
                required={true}
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
                className={props.darkMode ? "form-control form-dark" : "form-control"}
                onChange={handleGoalsChange}
                ref={extrinsicRef}
                required={true}
              />
            </div>
            <br></br>
            <div className="form-group">
              <h3>
                Reminder Date:
              </h3>
              <input
                type="date"
                name="reminderDate"
                placeholder="Enter the date on which you would like to be reminded about this goal..."
                className={props.darkMode ? "form-control form-dark" : "form-control"}
                onChange={handleGoalsChange}
                ref={reminderDate}
                required={true}
                min = {tommorowDate}
              />
            </div>
            <br></br>
            <div className="form-group">
              <h3>Priority: </h3>
              <PrioritySelect className={props.darkMode ? "form-control form-dark" : "form-control"} value={priority} onChange={(e) => setPriority(e.target.value)} />
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
