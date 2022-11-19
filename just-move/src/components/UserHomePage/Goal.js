import React from 'react';
import "rsuite/dist/rsuite.min.css";
import ButtonGroup from 'rsuite/ButtonGroup';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';
import IconButton from 'rsuite/IconButton';
import Progress from 'rsuite/Progress';
import PopupSubGoalForm from "./PopupSubGoalForm";
import PlusIcon from '@rsuite/icons/Plus';

import { TagPicker } from 'rsuite';

import { useState, useRef, useEffect } from 'react';

export function Goal({ props, handleDeleteGoal, handleEditGoal, categoryList, updateGoalList }) {
    const [editing, setEditing] = useState(false);
    const [startDate, setStartDate] = useState(props.startDate);
    const [goal, setGoal] = useState(props.goal);
    const [intrinsicMotivation, setIntrinsicMotivation] = useState(props.intrinsicMotivation);
    const [extrinsicMotivation, setExtrinsicMotivation] = useState(props.extrinsicMotivation);
    const [reminderDate, setReminderDate] = useState(props.reminderDate);
    const [mostRecentDate, setMostRecentDate] = useState(props.mostRecentDate);
    const [category, setCategory] = useState(props.category);
    const [subgoal, setSubgoal] = useState(props.subgoal);
    const [popupBtn, setPopupBtn] = useState(false);
    const [errModal, setErrModal] = useState(null);

    let subgoalsComplete = 0;
    props.subgoal.forEach(item => subgoalsComplete += (item.completed ? 1 : 0));
    const percentCompletion = props.subgoal.length === 0 ? 0 : Math.round(subgoalsComplete / props.subgoal.length * 100);
    const status = percentCompletion === 100 ? 'success' : null;

    const startModal = (msg, title) => {
        setErrModal({ msg: msg, title: title });
    }

    const data = ['Fitness', 'Work', 'Hobby'].map(
        item => ({
            label: item,
            value: item,
        })
    );

    const completedToggle = (index) => {
        subgoal[index].completed = !subgoal[index].completed;
        handleEditGoal(props.id, startDate, goal, intrinsicMotivation, extrinsicMotivation, reminderDate, category, subgoal);
    }

    const cancelChanges = () => {
        setStartDate(props.startDate);
        setGoal(props.goal);
        setIntrinsicMotivation(props.intrinsicMotivation);
        setExtrinsicMotivation(props.extrinsicMotivation);
        setReminderDate(props.reminderDate);
        setMostRecentDate(props.mostRecentDate);
        setCategory(props.category);
    };

    const editToggle = (e) => {
        setEditing(!editing);
        if(editing === true) {
            handleEditGoal(props.id, startDate, goal, intrinsicMotivation, extrinsicMotivation, reminderDate, category, subgoal);
        }
    };

    return (
        <tr>
          <td>{editing ? <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="text"/> : startDate}</td>
          <td>{editing ? <input value={goal} onChange={(e) => setGoal(e.target.value)} type="text"/> : goal}</td>
          <td>{editing ? <input value={intrinsicMotivation} onChange={(e) => setIntrinsicMotivation(e.target.value)} type="text"/> : intrinsicMotivation}</td>
          <td>{editing ? <input value={extrinsicMotivation} onChange={(e) => setExtrinsicMotivation(e.target.value)} type="text"/> : extrinsicMotivation}</td>
          <td>{editing ? <input value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} type="text"/> : reminderDate}</td>
          <td>{editing ? <input value={mostRecentDate} onChange={(e) => setMostRecentDate(e.target.value)} type="text"/> : mostRecentDate}</td>
          <td><Progress.Line percent={percentCompletion} status={status}/></td>
          {/* <td>{editing ? <input value={category} onChange={(e) => setCategory(e.target.value)} type="text"/> : category}</td>*/}

          <td>
            <ul style={{listStyle:'none', paddingLeft:'0px'}}>
              {Object.entries(subgoal).map(([key, value],index) =>
                  <li key={index}>
                    <input value={value.name} id={index} type="checkbox" checked={value.completed} onChange={() => completedToggle(index)}/> {value.name}
                  </li>
              )}
            </ul>
          </td>

          <td><TagPicker
                creatable={false}
                readOnly={!editing}
                plaintext={!editing}
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
          <PopupSubGoalForm
              trigger={popupBtn}
              setPopupBtnTrigger={setPopupBtn}
              id={props.id}
              goal={goal}
              intrinsicMotivation={intrinsicMotivation}
              extrinsicMotivation={extrinsicMotivation}
              subgoal={subgoal}
              category={category}
              startDate={startDate}
              reminderDate={reminderDate}
              setSubgoal={setSubgoal}
              startModal={startModal}
              handleEditGoal={handleEditGoal}>
            </PopupSubGoalForm>
            <ButtonGroup justified>
              <IconButton icon={<PlusIcon />} appearance="primary" color="cyan" onClick={() => setPopupBtn(true)}/>
              <IconButton icon={<EditIcon />} active={editing} appearance="primary" color="blue" onClick={()=> editToggle(props.id)}></IconButton>
              <IconButton icon={<TrashIcon />} appearance="primary" color="red" onClick={()=> handleDeleteGoal(props.id)}></IconButton>
            </ButtonGroup>
          </td>
        </tr>
    );
}
