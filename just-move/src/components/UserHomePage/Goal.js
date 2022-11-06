import React from 'react';
import "rsuite/dist/rsuite.min.css";
import ButtonGroup from 'rsuite/ButtonGroup';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';
import IconButton from 'rsuite/IconButton';
import Progress from 'rsuite/Progress';

import { useState, useRef, useEffect } from 'react';

const priorityStrings = ["----", "---", "--", "-", "=", "+", "++", "+++", "++++"];

export function Goal({ props, handleDeleteGoal, handleEditGoal }) {
  const percentCompletion = props.progress.value / props.progress.target * 100;
  const status = percentCompletion === 100 ? 'success' : null;
  const [editing, setEditing] = useState(false);

  const [goal, setGoal] = useState(props.goal);
  const [intrinsicMotivation, setIntrinsicMotivation] = useState(props.intrinsicMotivation);
  const [extrinsicMotivation, setExtrinsicMotivation] = useState(props.extrinsicMotivation);
  const [priority, setPriority] = useState(props.priority);

  const cancelChanges = () => {
    setGoal(props.goal);
    setIntrinsicMotivation(props.intrinsicMotivation);
    setExtrinsicMotivation(props.extrinsicMotivation);
  };

  const editToggle = (e) => {
    setEditing(!editing);
    if (editing === true) {
      handleEditGoal(props.id, goal, intrinsicMotivation, extrinsicMotivation);
    }
  };

  return (
    <tr>
      <td>{editing ? <input value={goal} onChange={(e) => setGoal(e.target.value)} type="text" /> : goal}</td>
      <td>{editing ? <input value={intrinsicMotivation} onChange={(e) => setIntrinsicMotivation(e.target.value)} type="text" /> : intrinsicMotivation}</td>
      <td>{editing ? <input value={extrinsicMotivation} onChange={(e) => setExtrinsicMotivation(e.target.value)} type="text" /> : extrinsicMotivation}</td>
      <td>{editing ? <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="4">++++</option>
        <option value="3">+++</option>
        <option value="2">++</option>
        <option value="1">+</option>
        <option value="0">=</option>
        <option value="-1">-</option>
        <option value="-2">--</option>
        <option value="-3">---</option>
        <option value="-4">----</option>
      </select> : priorityStrings[priority + 4]}</td>
      <td><Progress.Line percent={percentCompletion} status={status} /></td>
      <td>
        <ButtonGroup justified>
          <IconButton icon={<EditIcon />} active={editing} appearance="primary" color="blue" onClick={() => editToggle(props.id)}></IconButton>
          <IconButton icon={<TrashIcon />} appearance="primary" color="red" onClick={() => handleDeleteGoal(props.id)}></IconButton>
        </ButtonGroup>
      </td>
    </tr>
  );
}
