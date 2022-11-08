import {useState, useRef } from "react";
import React from 'react';
import "./PopupGoalForm.css"
import IconButton from 'rsuite/IconButton';
import PlusIcon from '@rsuite/icons/Plus';
import CloseIcon from '@rsuite/icons/Close';
import { nanoid } from 'nanoid';
import { saveAddGoal } from "./saving";
import {Goal} from "./Goal";

function PopupsubGoalsForm(props){
    
    const subgoalRef= useRef(null);

    const handlesubGoalsChange = (e) => {
        e.preventDefault();
        const subgoalName = e.target.getAttribute("name");
        const subgoalValue = e.target.value;
        //const newsubGoalData = { ...props.addsubGoalData };
        //newsubGoalData[subgoalName] = subgoalValue;
        props.setsubgoal(subgoalValue);
      }
    
      const handleAddNewSubGoal = (e) => {
        e.preventDefault();
    
        // const newsubGoal = {
        //   id: nanoid(),
        //   subgoal: props.addGoalData.subgoal,
        //   progress: " ",
        // }
    
        const newsubGoals = [...props.subgoals];
        // props.setsubgoal(newsubGoals);
        // if(subgoalRef.current.value != ""){
        // props.setsubGoals(newsubGoals);
        // }
        // subgoalRef.current.value = "";
        props.setsubgoal(newsubGoals);
      }

    return (props.trigger) ? (
      <div className="popup">
        <div className="popup-inner">
          <form onSubmit={handleAddNewSubGoal} id="popup-form">
            <h2>Add Some Tasks For Your Goal!</h2>
            <br></br>
            <div className="form-group">
              <h3>
                SubGoal:
              </h3>
              <input
                type="input"
                name="subgoal"
                placeholder="Enter a subgoal..."
                className="form-control"
                onChange={handlesubGoalsChange}
                ref={subgoalRef}
                style={{ visibility: `visible`, animation: `fadeInLeft` }}
              />
            </div>
            
            <br></br>
            <br></br>
            <IconButton type="submit"
              icon={<PlusIcon />}
              appearance="primary"
              color="cyan"
              id="add-subgoal-btn">
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
  
  export default PopupsubGoalsForm
  