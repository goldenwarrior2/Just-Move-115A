import React from 'react';
import "rsuite/dist/rsuite.min.css";
import ButtonGroup from 'rsuite/ButtonGroup';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';
import IconButton from 'rsuite/IconButton';
import Progress from 'rsuite/Progress';

import { TagPicker } from 'rsuite';

import { useState, useRef, useEffect } from 'react';

export function Goal({ props, handleDeleteGoal, handleEditGoal, categoryList, updateGoalList }) {
    const percentCompletion = props.progress.value / props.progress.target * 100;
    const status = percentCompletion === 100 ? 'success' : null;
    const [editing, setEditing] = useState(false);

    const [goal, setGoal] = useState(props.goal);
    const [intrinsicMotivation, setIntrinsicMotivation] = useState(props.intrinsicMotivation);
    const [extrinsicMotivation, setExtrinsicMotivation] = useState(props.extrinsicMotivation);
    const [category, setCategory] = useState(props.category);

    const data = ['Fitness', 'Work', 'Hobby'].map(
        item => ({
            label: item,
            value: item,
        })
    );

    const cancelChanges = () => {
        setGoal(props.goal);
        setIntrinsicMotivation(props.intrinsicMotivation);
        setExtrinsicMotivation(props.extrinsicMotivation);
        setCategory(props.category);
    };

    const editToggle = (e) => {
        setEditing(!editing);
        if(editing === true) {
          handleEditGoal(props.id, goal, intrinsicMotivation, extrinsicMotivation, category);
        }
    };

    return (
        <tr>
          <td>{editing ? <input value={goal} onChange={(e) => setGoal(e.target.value)} type="text"/> : goal}</td>
          <td>{editing ? <input value={intrinsicMotivation} onChange={(e) => setIntrinsicMotivation(e.target.value)} type="text"/> : intrinsicMotivation}</td>
          <td>{editing ? <input value={extrinsicMotivation} onChange={(e) => setExtrinsicMotivation(e.target.value)} type="text"/> : extrinsicMotivation}</td>
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
              <IconButton icon={<EditIcon />} active={editing} appearance="primary" color="blue" onClick={()=> editToggle(props.id)}></IconButton>
              <IconButton icon={<TrashIcon />} appearance="primary" color="red" onClick={()=> handleDeleteGoal(props.id)}></IconButton>
            </ButtonGroup>
          </td>
        </tr>
    );
}
