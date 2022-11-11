import React from 'react';
import "rsuite/dist/rsuite.min.css";
import ButtonGroup from 'rsuite/ButtonGroup';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';
import IconButton from 'rsuite/IconButton';
import PlusIcon from '@rsuite/icons/Plus';
import Progress from 'rsuite/Progress';
import PopupSubGoalForm from "./PopupSubGoalForm";

import { useState, useRef, useEffect } from 'react';

export function Goal({ props, handleDeleteGoal, handleEditGoal }) {
    const percentCompletion = props.progress.value / props.progress.target * 100;
    const status = percentCompletion === 100 ? 'success' : null;
    const [editing, setEditing] = useState(false);

    const [goal, setGoal] = useState(props.goal);
    const [intrinsicMotivation, setIntrinsicMotivation] = useState(props.intrinsicMotivation);
    const [extrinsicMotivation, setExtrinsicMotivation] = useState(props.extrinsicMotivation);
    const [subgoal, setSubgoal] = useState(props.subgoal);

    const [popupBtn, setPopupBtn] = useState(false);
    const [errModal, setErrModal] = useState(null);
    const startModal = (msg, title) => {
        setErrModal({ msg: msg, title: title });
    }
    
    const cancelChanges = () => {
        setGoal(props.goal);
        setIntrinsicMotivation(props.intrinsicMotivation);
        setExtrinsicMotivation(props.extrinsicMotivation);
    };

    const editToggle = (e) => {
        setEditing(!editing);
        if(editing === true) {
            handleEditGoal(props.id, goal, intrinsicMotivation, extrinsicMotivation);
        }
    };

    return (
        <tr>
          <td>{editing ? <input value={goal} onChange={(e) => setGoal(e.target.value)} type="text"/> : goal}</td>
          <td>{editing ? <input value={intrinsicMotivation} onChange={(e) => setIntrinsicMotivation(e.target.value)} type="text"/> : intrinsicMotivation}</td>
          <td>{editing ? <input value={extrinsicMotivation} onChange={(e) => setExtrinsicMotivation(e.target.value)} type="text"/> : extrinsicMotivation}</td>
          <td><Progress.Line percent={percentCompletion} status={status}/></td>
          <td>
            <ul>
              {subgoal.map((sg) => <li key={sg}>{sg}</li>)}
            </ul>
          </td>
          <td>
            <PopupSubGoalForm
              trigger={popupBtn}
              setPopupBtnTrigger={setPopupBtn}
              id={props.id}
              goal={goal}
              intrinsicMotivation={intrinsicMotivation}
              extrinsicMotivation={extrinsicMotivation}
              progress={{value:1, target:5}}
              subgoal={subgoal}
              setSubgoal={setSubgoal}
              startModal={startModal} >
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
