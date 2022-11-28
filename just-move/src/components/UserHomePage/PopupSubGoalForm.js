import { useState, useRef } from "react";
import React from 'react';
import "./PopupGoalForm.css";
import IconButton from 'rsuite/IconButton';
import PlusIcon from '@rsuite/icons/Plus';
import CloseIcon from '@rsuite/icons/Close';
import { nanoid } from 'nanoid';
import { saveAddGoal } from "./saving";

function PopupSubGoalForm(props) {

  const [sg, setsg] = useState();
  const sgList = props.subgoal;

  const handleGoalsChange = (e) => {
    e.preventDefault();
    setsg(e.target.value);
  }

  const handleAddNewGoal = (e) => {
    e.preventDefault();
    const newSubgoal = { name: sg, completed: false };
    sgList.push(newSubgoal);
    props.setSubgoal(sgList);
    props.handleEditGoal(props.id, props.startDate, props.goal, props.intrinsicMotivation, props.extrinsicMotivation, props.priority, props.reminderDate, props.category, props.subgoal, props.completed);
  }

  return (props.trigger) ? (
    <div className="popup">
      <div className={props.darkMode ? "popup-inner popup-dark" : "popup-inner"}>
        <form onSubmit={handleAddNewGoal} id="popup-form">
          <h2>Let's Create a Subtask</h2>
          <br></br>
          <div className="form-group">
            <h3>
              Subtask:
            </h3>
            <input
              type="input"
              name="goal"
              placeholder="Enter a subgoal..."
              className={props.darkMode ? "form-control form-dark" : "form-control"}
              onChange={handleGoalsChange}
              style={{ visibility: `visible`, animation: `fadeInLeft` }}
            />
          </div>
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
          onClick={() => props.setPopupBtnTrigger(false)}>
        </IconButton>
      </div>
    </div>
  ) : "";
}

export default PopupSubGoalForm;
