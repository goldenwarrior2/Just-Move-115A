import React from 'react';
import "rsuite/dist/rsuite.min.css";
import ButtonGroup from 'rsuite/ButtonGroup';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';
import IconButton from 'rsuite/IconButton';
import Progress from 'rsuite/Progress';
import PlusIcon from '@rsuite/icons/Plus';
import PopupsubGoalsForm from "./PopupsubGoalsForm";

import { useState, useRef, useEffect } from 'react';

export function Goal({ props, handleDeleteGoal, handleEditGoal, handlesubGoal }) {
    const percentCompletion = props.progress.value / props.progress.target * 100;
    const status = percentCompletion === 100 ? 'success' : null;
    const [editing, setEditing] = useState(false);
    const [popupBtn, setPopupBtn] = useState(false);

    const [goal, setGoal] = useState(props.goal);
    const [intrinsicMotivation, setIntrinsicMotivation] = useState(props.intrinsicMotivation);
    const [extrinsicMotivation, setExtrinsicMotivation] = useState(props.extrinsicMotivation);
    const [subgoal, setsubgoal] = useState([props.subgoal]);

    const subgoalRef = useRef(null);
    
    const [addsubGoalData, setsubGoalData] = useState({
      subgoali: "",
      progress: "",
    });
  

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

    const handleAddsubGoal = (e) => {
    setPopupBtn(true);
    //setsubgoal(subgoal);
    //setsubgoal(addsubGoalData.subgoali);
    handlesubGoal(props.id,subgoal);
    //setsubgoal(props.subgoal);
    }



    return (
        <tr>
          <td>{editing ? <input value={goal} onChange={(e) => setGoal(e.target.value)} type="text"/> : goal}</td>
          <td>{editing ? <input value={intrinsicMotivation} onChange={(e) => setIntrinsicMotivation(e.target.value)} type="text"/> : intrinsicMotivation}</td>
          <td>{editing ? <input value={extrinsicMotivation} onChange={(e) => setExtrinsicMotivation(e.target.value)} type="text"/> : extrinsicMotivation}</td>
          <td><Progress.Line percent={percentCompletion} status={status}/></td>
          <td> {subgoal} </td>
          <td>
          <PopupsubGoalsForm trigger={popupBtn}
        setPopupBtnTrigger={setPopupBtn}
        subgoal={subgoal}
        setsubgoal={setsubgoal}
        subgoalRef={subgoalRef}
        addsubGoalData={addsubGoalData}
        setsubGoalData={setsubGoalData}
      >
      </PopupsubGoalsForm>
            <ButtonGroup justified>
              <IconButton icon={<PlusIcon />} appearance="primary" color="cyan" onClick={()=> handleAddsubGoal(props.id)}></IconButton>
              <IconButton icon={<EditIcon />} active={editing} appearance="primary" color="blue" onClick={()=> editToggle(props.id)}></IconButton>
              <IconButton icon={<TrashIcon />} appearance="primary" color="red" onClick={()=> handleDeleteGoal(props.id)}></IconButton>
            </ButtonGroup>
          </td>
        </tr>
    );
}