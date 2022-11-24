import React from 'react';
import "rsuite/dist/rsuite.min.css";
import IconButton from 'rsuite/IconButton';
import Animation from 'rsuite/Animation';
import PopupSubGoalForm from "./PopupSubGoalForm";

import { FlexboxGrid } from 'rsuite';
import { Modal, Button, ButtonToolbar, Placeholder } from 'rsuite';

import { useState, useRef, useEffect } from 'react';

export function ExpandedGoal(props) {

  const goalTextColor = "#6231a3";

  return (
    <Animation.Bounce in={true}>
      <div style={{backgroundColor: 'rgba(204, 0, 204, 0.2)', color: goalTextColor}}>
        <FlexboxGrid>
          <FlexboxGrid.Item colspan={2}>{props.editing ? <input value={props.startDate} onChange={(e) => props.setStartDate(e.target.value)} type="text" className="form-control"/> : props.startDate}</FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={2}>{props.editing ? <input value={props.intrinsicMotivation} onChange={(e) => props.setIntrinsicMotivation(e.target.value)} type="text" className="form-control"/> : props.intrinsicMotivation}</FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={2}>{props.editing ? <input value={props.extrinsicMotivation} onChange={(e) => props.setExtrinsicMotivation(e.target.value)} type="text" className="form-control"/> : props.extrinsicMotivation}</FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={2}>{props.editing ? <input value={props.reminderDate} onChange={(e) => props.setReminderDate(e.target.value)} type="date" className="form-control"/> : props.reminderDate}</FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={2}>{props.editing ? <input value={props.mostRecentDate} onChange={(e) => props.setMostRecentDate(e.target.value)} type="text" className="form-control"/> : props.mostRecentDate}</FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={2}>
            <ul style={{listStyle:'none', paddingLeft:'0px'}}>
              {Object.entries(props.subgoal).map(([key, value],index) =>
                <li key={index}>
                  <input value={value.name} id={index} type="checkbox" checked={value.completed} onChange={() => props.completedToggle(index)}/> {value.name}
                </li>
              )}
            </ul>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </div>
    </Animation.Bounce>
  );
}
