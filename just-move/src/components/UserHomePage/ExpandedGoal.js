import React from 'react';
import "rsuite/dist/rsuite.min.css";
import Animation from 'rsuite/Animation';
import { FlexboxGrid } from 'rsuite';
import { goalTextColor, goalTextDarkColor } from "./Goal.js";

export function ExpandedGoal(props) {

  return (
    <Animation.Collapse in={props.expanded}>
      <div style={{ backgroundColor: 'rgba(204, 0, 204, 0.2)', color: props.darkMode ? goalTextDarkColor : goalTextColor }}>
        <FlexboxGrid>
          <FlexboxGrid.Item colspan={5}><h5>Intrinsic Motivation:</h5>{props.editing ? <input value={props.intrinsicMotivation} onChange={(e) => props.setIntrinsicMotivation(e.target.value)} type="text" className={props.darkMode ? "form-control form-dark" : "form-control"} /> : props.intrinsicMotivation}</FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={5}><h5>Extrinsic Motivation:</h5>{props.editing ? <input value={props.extrinsicMotivation} onChange={(e) => props.setExtrinsicMotivation(e.target.value)} type="text" className={props.darkMode ? "form-control form-dark" : "form-control"} /> : props.extrinsicMotivation}</FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={4}><h5>Reminder Date:</h5>{props.editing ? <input value={props.reminderDate} onChange={(e) => props.setReminderDate(e.target.value)} type="date" className={props.darkMode ? "form-control form-dark" : "form-control"} /> : props.reminderDate}</FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={4}><h5>Most Recent Date:</h5>{props.mostRecentDate}</FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={6}>
            <h5>Subtasks:</h5>
            <ul style={{ listStyle: 'none', paddingLeft: '0px' }}>
              {Object.entries(props.subgoal).map(([key, value], index) =>
                <li key={index}>
                  {!value.completed && <input value={value.name} id={index} type="checkbox" checked={value.completed} onChange={() => props.completedToggle(index)} />} {value.name}
                </li>
              )}
            </ul>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </div>
    </Animation.Collapse>
  );
}
