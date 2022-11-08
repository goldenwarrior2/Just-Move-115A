import {useState, useRef } from "react";
import React from 'react';
import "./PopupGoalForm.css"
import IconButton from 'rsuite/IconButton';
import PlusIcon from '@rsuite/icons/Plus';
import CloseIcon from '@rsuite/icons/Close';
import { nanoid } from 'nanoid';
import { saveAddGoal } from "./saving";

function PopupSubGoalForm(props) {

  const [sg, setsg] = useState();

  const handleGoalsChange = (e) => {
    e.preventDefault();
    setsg(e.target.value);
  }

  const handleAddNewGoal = (e) => {
    e.preventDefault();
    props.setSubgoal(sg);

    const newGoal = {
      id: props.id,
      goal: props.goal,
      intrinsicMotivation: props.intrinsicMotivation,
      extrinsicMotivation: props.extrinsicMotivation,
      progress: {value:1, target:5},
      subgoal: sg,
    }

    saveAddGoal(newGoal).catch(function (error) {
      props.startModal(error.toString(), "Error Adding Data");
      // Should we attempt to undo the change?
    });
  }

  return (props.trigger) ? (
    <div className="popup">
      <div className="popup-inner">
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
              className="form-control"
              onChange={handleGoalsChange}
              //ref={goalRef}
              style={{ visibility: `visible`, animation: `fadeInLeft` }}
            />
          </div>
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
    </div>
  ) : "";
}

export default PopupSubGoalForm;
