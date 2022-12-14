import React from 'react';
import "rsuite/dist/rsuite.min.css";
import ButtonGroup from 'rsuite/ButtonGroup';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';
import IconButton from 'rsuite/IconButton';
import Progress from 'rsuite/Progress';
import Animation from 'rsuite/Animation';
import PopupSubGoalForm from "./PopupSubGoalForm";
import PlusIcon from '@rsuite/icons/Plus';
import { ExpandedGoal } from "./ExpandedGoal";


import { TagPicker } from 'rsuite';
import { FlexboxGrid } from 'rsuite';
import { Modal } from 'rsuite';

import { useState, useRef, useEffect } from 'react';
import { priorityRange, PrioritySelect, priorityStrings } from './PrioritySelect';

export const goalTextColor = "#6231a3";
export const goalTextDarkColor = "#c9dbb2";

export function Goal({ props, handleDeleteGoal, handleEditGoal, categoryList, updateGoalList, darkMode }) {
  const [editing, setEditing] = useState(false);
  const [startDate, setStartDate] = useState(props.startDate);
  const [goal, setGoal] = useState(props.goal);
  const [intrinsicMotivation, setIntrinsicMotivation] = useState(props.intrinsicMotivation);
  const [extrinsicMotivation, setExtrinsicMotivation] = useState(props.extrinsicMotivation);
  const [reminderDate, setReminderDate] = useState(props.reminderDate);
  const [mostRecentDate, setMostRecentDate] = useState(props.mostRecentDate);
  const [category, setCategory] = useState(props.category);
  const [subgoal, setSubgoal] = useState(props.subgoal);
  const [priority, setPriority] = useState(props.priority);
  const [popupBtn, setPopupBtn] = useState(false);
  const [errModal, setErrModal] = useState(null);

  const completed = status === null ? false : true;

  const [expanded, setExpanded] = useState(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let subgoalsComplete = 0;
  props.subgoal.forEach(item => subgoalsComplete += (item.completed ? 1 : 0));
  const percentCompletion = props.subgoal.length === 0 ? 0 : Math.round(subgoalsComplete / props.subgoal.length * 100);
  const status = percentCompletion === 100 ? 'success' : null;

  const startModal = (msg, title) => {
    setErrModal({ msg: msg, title: title });
  }

  const data = categoryList.map(
    item => ({
      label: item,
      value: item,
    })
  );

  const completedToggle = (index) => {
    const { Timestamp } = require("firebase/firestore");
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${year}-${month}-${day}`;
    const oneWeekMillis = 604800000;
    const currentDateTimestamp = Timestamp.fromDate(new Date(currentDate));
    const currentDateMillis = currentDateTimestamp.toMillis();
    const limit = currentDateMillis + oneWeekMillis;
    const reminderDateTimestamp = reminderDate.length ? Timestamp.fromDate(new Date(reminderDate)) : Timestamp.fromDate(new Date(currentDate));
    const reminderDateMillis = reminderDateTimestamp.toMillis();
    const newReminderDateMillis = reminderDateMillis + oneWeekMillis;
    const newReminderDateTimestamp = Timestamp.fromMillis(newReminderDateMillis);
    const newReminderDate = newReminderDateTimestamp.toDate();
    const newReminderDateString = newReminderDate.toISOString().substring(0, 10);
    console.log(currentDateMillis);
    console.log(reminderDateMillis);
    console.log(limit);
    if (reminderDateMillis >= currentDateMillis && reminderDateMillis < limit) {
      console.log(currentDateMillis);
      console.log(reminderDateMillis);
      console.log(limit);
      setReminderDate(newReminderDateString);
    }
    setMostRecentDate(currentDate);
    subgoal[index].completed = !subgoal[index].completed;
    handleEditGoal(props.id, startDate, goal, intrinsicMotivation, extrinsicMotivation, priority, reminderDate, category, subgoal, completed, currentDate);
  }



  const handleChildElementClick = (e, callback) => {
    e.stopPropagation();
    if (callback) {
      callback(e);
    };
  };

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
      handleEditGoal(props.id, startDate, goal, intrinsicMotivation, extrinsicMotivation, priority, reminderDate, category, subgoal, completed, mostRecentDate);
    } else {
      setExpanded(true);
    }
  };

  return (
    <Animation.Bounce in={true}>
      <div style={{ backgroundColor: 'rgba(204, 0, 204, 0.3)', color: darkMode ? goalTextDarkColor : goalTextColor }}>
        <Modal open={open} onClose={handleClose} dialogClassName={darkMode ? "popup-dark" : ""}>
          <Modal.Body>
            <PopupSubGoalForm
              trigger={popupBtn}
              setPopupBtnTrigger={setPopupBtn}
              id={props.id}
              goal={goal}
              intrinsicMotivation={intrinsicMotivation}
              extrinsicMotivation={extrinsicMotivation}
              subgoal={subgoal}
              category={category}
              priority={priority}
              startDate={startDate}
              reminderDate={reminderDate}
              setSubgoal={(e) => { setSubgoal(e); handleClose() }}
              startModal={startModal}
              handleEditGoal={handleEditGoal}
              handleClose={handleClose}
              completed={completed}
              mostRecentDate={mostRecentDate}
              darkMode={darkMode}>
            </PopupSubGoalForm>
          </Modal.Body>
        </Modal>
        <FlexboxGrid onClick={() => setExpanded(!expanded)}>
          <FlexboxGrid.Item colspan={3}>{startDate}</FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={4}>{editing ? <input value={goal} onChange={(e) => setGoal(e.target.value)} onClick={handleChildElementClick} type="text" className={darkMode ? "form-control form-dark" : "form-control"} /> : goal}</FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={3}>{editing ? <PrioritySelect value={priority} onChange={(e) => setPriority(e.target.value)} className={darkMode ? "form-control form-dark" : "form-control"} /> : priorityStrings[priority + priorityRange]}</FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={6}><Progress.Line percent={percentCompletion} status={status} /></FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={5} onClick={handleChildElementClick}><TagPicker
            creatable={false}
            readOnly={!editing}
            plaintext={!editing}
            data={categoryList}
            defaultValue={category}
            style={{ width: 300 }}
            menuStyle={darkMode ? { width: 300, background: "#202124", color: "whitesmoke" } : { width: 300 }}
            onCreate={(value, item) => {
              updateGoalList(value[0]);
              console.log(value, item);
              console.log(data);
            }}
            onChange={(value) => {
              setCategory(value);
            }}
          />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={3}>
            <ButtonGroup justified>
              <IconButton icon={<PlusIcon />} appearance="primary" color="cyan" onClick={(e) => handleChildElementClick(e, handleOpen)} />
              <IconButton icon={<EditIcon />} active={editing} appearance="primary" color="violet" onClick={(e) => handleChildElementClick(e, editToggle)}></IconButton>
              <IconButton icon={<TrashIcon />} appearance="primary" color="red" onClick={(e) => handleDeleteGoal(props.id)}></IconButton>
            </ButtonGroup>
          </FlexboxGrid.Item>
        </FlexboxGrid>
        <ExpandedGoal
          editing={editing}
          startDate={startDate}
          setStartDate={setStartDate}
          intrinsicMotivation={intrinsicMotivation}
          setIntrinsicMotivation={setIntrinsicMotivation}
          extrinsicMotivation={extrinsicMotivation}
          setExtrinsicMotivation={setExtrinsicMotivation}
          reminderDate={reminderDate}
          setReminderDate={setReminderDate}
          mostRecentDate={mostRecentDate}
          setMostRecentDate={setMostRecentDate}
          subgoal={subgoal}
          completedToggle={completedToggle}
          expanded={expanded}
          darkMode={darkMode}
        />
      </div>
    </Animation.Bounce >
  );
}
