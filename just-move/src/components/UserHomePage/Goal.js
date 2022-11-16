import React from 'react';
import "rsuite/dist/rsuite.min.css";
import ButtonGroup from 'rsuite/ButtonGroup';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';
import IconButton from 'rsuite/IconButton';
import Progress from 'rsuite/Progress';
import Animation from 'rsuite/Animation';

import { TagPicker } from 'rsuite';

import { useState, useRef, useEffect } from 'react';
import { PrioritySelect, priorityStrings } from './PrioritySelect';

export function Goal({ props, handleDeleteGoal, handleEditGoal, categoryList, updateGoalList }) {
  const percentCompletion = props.progress.value / props.progress.target * 100;
  const status = percentCompletion === 100 ? 'success' : null;
  const [editing, setEditing] = useState(false);

  const [startDate, setStartDate] = useState(props.startDate);
  const [goal, setGoal] = useState(props.goal);
  const [intrinsicMotivation, setIntrinsicMotivation] = useState(props.intrinsicMotivation);
  const [extrinsicMotivation, setExtrinsicMotivation] = useState(props.extrinsicMotivation);
  const [reminderDate, setReminderDate] = useState(props.reminderDate);
  const [mostRecentDate, setMostRecentDate] = useState(props.mostRecentDate);
  const [category, setCategory] = useState(props.category);
  const [priority, setPriority] = useState(props.priority);

  const data = ['Fitness', 'Work', 'Hobby'].map(
    item => ({
      label: item,
      value: item,
    })
  );

  const goalTextColor = "#6231a3";

  const cancelChanges = () => {
    setStartDate(props.startDate);
    setGoal(props.goal);
    setIntrinsicMotivation(props.intrinsicMotivation);
    setExtrinsicMotivation(props.extrinsicMotivation);
    setReminderDate(props.reminderDate);
    setMostRecentDate(props.mostRecentDate);
    setCategory(props.category);
    setPriority(props.priority);
  };

  const editToggle = (e) => {
    setEditing(!editing);
    if (editing === true) {
      setPriority(parseInt(priority));
      handleEditGoal(props.id, startDate, goal, intrinsicMotivation, extrinsicMotivation, priority, reminderDate, category);
    }
  };

    return (
      <Animation.Bounce in={true}>
        <tr style={{backgroundColor: 'rgba(204, 0, 204, 0.3)', color: goalTextColor}}>
          <td>{editing ? <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="text" className="form-control"/> : startDate}</td>
          <td>{editing ? <input value={goal} onChange={(e) => setGoal(e.target.value)} type="text" className="form-control"/> : goal}</td>
          <td>{editing ? <input value={intrinsicMotivation} onChange={(e) => setIntrinsicMotivation(e.target.value)} type="text" className="form-control"/> : intrinsicMotivation}</td>
          <td>{editing ? <input value={extrinsicMotivation} onChange={(e) => setExtrinsicMotivation(e.target.value)} type="text" className="form-control"/> : extrinsicMotivation}</td>
          <td>{editing ? <input value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} type="date" className="form-control"/> : reminderDate}</td>
          <td>{editing ? <input value={mostRecentDate} onChange={(e) => setMostRecentDate(e.target.value)} type="text" className="form-control"/> : mostRecentDate}</td>
          <td><Progress.Line percent={percentCompletion} status={status}/></td>
          {/* <td>{editing ? <input value={category} onChange={(e) => setCategory(e.target.value)} type="text"/> : category}</td>*/}
          <td><TagPicker
                creatable={false}
                readOnly={!editing}
                data={categoryList}
                defaultValue={category}
                style={{ width: 300 }}
                menuStyle={{ width: 300 }}
                onCreate={(value, item) => {
                  updateGoalList(value[0]);
                  console.log(value, item);
                  console.log(data);
                }}
                onChange={(value) => {
                  setCategory(value);
                }}
              />
          </td>
          <td>
            <ButtonGroup justified>
              <IconButton icon={<EditIcon />} active={editing} appearance="primary" color="violet" onClick={()=> editToggle(props.id)}></IconButton>
              <IconButton icon={<TrashIcon />} appearance="primary" color="red" onClick={()=> handleDeleteGoal(props.id)}></IconButton>
            </ButtonGroup>
          </td>
        </tr>
        </Animation.Bounce>
    );
}
