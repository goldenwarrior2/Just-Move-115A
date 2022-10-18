import { useDebugValue, useState, useRef } from 'react';
import React from 'react';
import { Goal } from "./Goal";
import { nanoid } from 'nanoid';

export function UserHomePage () {

  const goalRef = useRef(null); 
  const intrinsicRef = useRef(null);
  const extrinsicRef = useRef(null);

  const [task, setTask] = useState("");

  const [goals, setGoals] = useState([]);

  const [addGoalData, setGoalData] = useState({
    goal: "",
    intrinsicMotivation: "",
    extrinsicMotivation: "",
    progress: "",
  });

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

  return (
    <div>
      <h1>Welcome to your home page!</h1>
      <form onSubmit={handleAddNewGoal}>
        <h2>Let's Create a Goal!</h2>
        <input
          type="input"
          name="goal"
          placeholder="Enter a goal..."
          ref={goalRef}
          onChange={handleGoalsChange}
        />
        <input
          type="input"
          name="intrinsicMotivation"
          placeholder="Enter your intrinsic motivation for this goal..."
          ref={intrinsicRef}
          onChange={handleGoalsChange}
        />
        <input
          type="input"
          name="extrinsicMotivation"
          placeholder="Enter your extrinsic motivation for this goal..."
          ref={extrinsicRef}
          onChange={handleGoalsChange}
        />
        <button type="submit">Add Goal!</button>
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
          <Goal props={newGoal} key={newGoal.id}/>
        ))}
      </tbody>
    </table>
    </div>
  )
}