import { useState, useRef } from 'react';
import React from 'react';
import { Goal } from "./Goal";
import PopupGoalForm from "./PopupGoalForm";

export function UserHomePage () {

  const goalRef = useRef(null); 

  const [goals, setGoals] = useState([]);

  const [addGoalData, setGoalData] = useState({
    goal: "",
    intrinsicMotivation: "",
    extrinsicMotivation: "",
    progress: "",
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
      <h1>Just Move</h1>
      <button onClick={() => setPopupBtn(true)}>
        Add a new goal!
      </button>
      <PopupGoalForm trigger={popupBtn}
      setPopupBtnTrigger={setPopupBtn}
      goalRef={goalRef}
      addGoalData={addGoalData}
      setGoalData={setGoalData}
      goals={goals}
      setGoals={setGoals}>
      </PopupGoalForm>
      <table id="goals-table" className="table mt-5">
      <thead>
        <tr>
          <th scope="col">Goal</th>
          <th scope="col">Intrinsic Motivations</th>
          <th scope="col">Extrinsic Motivations</th>
          <th scope="col">Progress Bar</th>
        </tr>
      </thead>
      <tbody id="goals-table-body">
        {goals.map((newGoal)=> (
          <Goal props={newGoal} key={newGoal.id} handleDeleteGoal={handleDeleteGoal}/>
        ))}
      </tbody>
    </table>
    </div>
  )
}