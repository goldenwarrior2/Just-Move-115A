import { useState, useRef } from 'react';
import React from 'react';
import { Goal } from "./Goal";
import Modal from "./Modal";
import { nanoid } from 'nanoid';
import IconButton from 'rsuite/IconButton';
import PlusIcon from '@rsuite/icons/Plus';

export function UserHomePage () {

  const goalRef = useRef(null); 
  const intrinsicRef = useRef(null);
  const extrinsicRef = useRef(null);

  const [goals, setGoals] = useState([]);

  const [addGoalData, setGoalData] = useState({
    goal: "",
    intrinsicMotivation: "",
    extrinsicMotivation: "",
    progress: "",
  });

  const [popupBtn, setPopupBtn] = useState(false);

  const handleGoalsChange = (e) => {
    e.preventDefault();
    const goalName = e.target.getAttribute("name");
    const goalValue = e.target.value;
    const newGoalData = { ...addGoalData };
    newGoalData[goalName] = goalValue;
    setGoalData(newGoalData);
  }

  const handleAddNewGoal = (e) => {
    e.preventDefault();

    const newGoal = {
      id: nanoid(),
      goal: addGoalData.goal,
      intrinsicMotivation: addGoalData.intrinsicMotivation,
      extrinsicMotivation: addGoalData.extrinsicMotivation,
      progress: " ",
    }

    const newGoals = [...goals, newGoal];
    setGoals(newGoals);

    goalRef.current.value = "";
    intrinsicRef.current.value = "";
    extrinsicRef.current.value = "";
  }

  const handleDeleteGoal = (goalId) => {
    const newGoals = [...goals];

    const index = goals.findIndex((goal)=> goal.id === goalId);

    newGoals.splice(index, 1);

    setGoals(newGoals);
  }

  return (
    <div>
      <h1>Welcome to your home page!</h1>
      <button onClick={() => setPopupBtn(true)}>
        Open
      </button>
      <Modal trigger={popupBtn}
      setPopupBtnTrigger={setPopupBtn}>
      </Modal>
      <form onSubmit={handleAddNewGoal}>
        <h2>Let's Create a Goal!</h2>
        <div className="form-group">
          <label>
            Goal:
          </label>
          <input
            type="input"
            name="goal"
            placeholder="Enter a goal..."
            ref={goalRef}
            className="form-control"
            onChange={handleGoalsChange}
          />
        </div>
        <div className="form-group">
          <label>
            Intrinsic Goal:
          </label>
          <input
            type="input"
            name="intrinsicMotivation"
            placeholder="Enter your intrinsic motivation for this goal..."
            ref={intrinsicRef}
            className="form-control"
            onChange={handleGoalsChange}
          />
        </div>
        <div className="form-group">
          <label>
            Extrinsic Goal:
          </label>
          <input
            type="input"
            name="extrinsicMotivation"
            placeholder="Enter your extrinsic motivation for this goal..."
            ref={extrinsicRef}
            className="form-control"
            onChange={handleGoalsChange}
          />
        </div>
        <IconButton type="submit" icon={<PlusIcon />} appearance="primary" color="green"></IconButton>
      </form>
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