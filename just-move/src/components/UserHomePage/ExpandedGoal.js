import React from 'react';
import "rsuite/dist/rsuite.min.css";
import Animation from 'rsuite/Animation';
import { FlexboxGrid } from 'rsuite';

export function ExpandedGoal(props) {

  const goalTextColor = "#6231a3";

  return (
    <Animation.Collapse in={props.expanded}>
      <div style={{backgroundColor: 'rgba(204, 0, 204, 0.2)', color: goalTextColor}}>
        <FlexboxGrid>
          <FlexboxGrid.Item colspan={5}><h5>Intrinsic Motivation:</h5>{props.editing ? <input value={props.intrinsicMotivation} onChange={(e) => props.setIntrinsicMotivation(e.target.value)} type="text" className="form-control"/> : props.intrinsicMotivation}</FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={5}><h5>Extrinsic Motivation:</h5>{props.editing ? <input value={props.extrinsicMotivation} onChange={(e) => props.setExtrinsicMotivation(e.target.value)} type="text" className="form-control"/> : props.extrinsicMotivation}</FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={4}><h5>Reminder Date:</h5>{props.editing ? <input value={props.reminderDate} onChange={(e) => props.setReminderDate(e.target.value)} type="date" className="form-control"/> : props.reminderDate}</FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={4}><h5>Most Recent Date:</h5>{props.editing ? <input value={props.mostRecentDate} onChange={(e) => props.setMostRecentDate(e.target.value)} type="text" className="form-control"/> : props.mostRecentDate}</FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={6}>
            <h5>Subtasks:</h5>
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
    </Animation.Collapse>
  );
}
