import { useState, useRef } from 'react';
import React from 'react';
import { Goal } from "./Goal";
import PopupGoalForm from "./PopupGoalForm";
import Button from 'rsuite/Button';
import Animation from 'rsuite/Animation'

import { ProgressBar } from "./ProgressBar";


export function UserHomePage () {

  const goalRef = useRef(null); 

  const [goals, setGoals] = useState([]);

  const [addGoalData, setGoalData] = useState({
    goal: "",
    intrinsicMotivation: "",
    extrinsicMotivation: "",
    progress: {value:1, target:5},
  });

  const [popupBtn, setPopupBtn] = useState(false);

  const handleDeleteGoal = (goalId) => {
    const newGoals = [...goals];

    const index = goals.findIndex((goal)=> goal.id === goalId);

    newGoals.splice(index, 1);

    setGoals(newGoals);
  }

  return (
    <div>
      <br></br>
      <div style={{textAlign: "center"}}>
      <Animation.Slide in={true} placement={React.useState('left')}>
        <h1
          style={{color: "#38ACEC"}}>
          Just Move
        </h1>
      </Animation.Slide>
      <br></br>
      <Animation.Slide in={true} placement={React.useState('right')}>
        <Button
          onClick={() => setPopupBtn(true)}
          color='green'
          appearance='primary'
          size='lg'
          style={{fontSize: "20px"}}>
            Add a new goal!
        </Button> 
      </Animation.Slide>
      </div>
      <PopupGoalForm trigger={popupBtn}
        setPopupBtnTrigger={setPopupBtn}
        goalRef={goalRef}
        addGoalData={addGoalData}
        setGoalData={setGoalData}
        goals={goals}
        setGoals={setGoals}>
      </PopupGoalForm>
        <table id="goals-table" className="table mt-5">
          <Animation.Bounce in={true}>
          <thead>
            <tr>
              <th scope="col">Goal</th>
              <th scope="col">Intrinsic Motivations</th>
              <th scope="col">Extrinsic Motivations</th>
              <th scope="col">Progress Bar</th>
            </tr>
          </thead>
          </Animation.Bounce>
          <tbody id="goals-table-body">
            {goals.map((newGoal)=> (
              <Goal props={newGoal} key={newGoal.id} handleDeleteGoal={handleDeleteGoal}/>
            ))}
          </tbody>
        </table>
    </div>
  )
}
