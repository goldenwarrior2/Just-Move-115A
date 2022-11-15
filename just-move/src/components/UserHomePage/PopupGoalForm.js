import { useState, useRef } from "react";
import React from 'react';
import "./PopupGoalForm.css"
import IconButton from 'rsuite/IconButton';
import PlusIcon from '@rsuite/icons/Plus';
import CloseIcon from '@rsuite/icons/Close';
import { nanoid } from 'nanoid';
import { saveAddGoal } from "./saving";
import { PrioritySelect } from "./PrioritySelect";

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
      progress: "progress",
      priority: parseInt(priority),
      added: Math.floor(Date.now() / 1000),
      reminderDate: props.addGoalData.reminderDate,
      mostRecentDate: props.addGoalData.mostRecentDate,
      category: [],
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

  return (props.trigger) ? (
    <div className="popup">
      <div className="popup-inner">
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
          <div className="form-group">
            <h3>Priority: </h3>
            <PrioritySelect className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)} />
          </div>
          <br></br>
          <br></br>
          <IconButton type="submit"
            icon={<PlusIcon />}
            appearance="primary"
            color="green"
            id="add-goal-btn">
          </IconButton>
        </form>
        <IconButton
          icon={<CloseIcon />}
          appearance="primary"
          color="red"
          id="close-btn"
          onClick={() => props.setPopupBtnTrigger(false)}>
        </IconButton>
      </div>
    </div >
  ) : "";
}

export default PopupGoalForm
