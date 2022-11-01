import { useState, useRef } from 'react';
import React from 'react';
import { Goal } from "./Goal";
import { SubGoal } from "./SubGoal";
import { nanoid } from 'nanoid';
import IconButton from 'rsuite/IconButton';
import PlusIcon from '@rsuite/icons/Plus';

export function UserHomePage () {

  const goalRef = useRef(null); 
  const intrinsicRef = useRef(null);
  const extrinsicRef = useRef(null);
  const subgoalRef= useRef(null);

  const [goals, setGoals] = useState([]);

  const [subgoals, setsubGoals] = useState([]);

  const [GoalList,setGoalList] = useState([]);

  const [addGoalData, setGoalData] = useState({
    goal: "",
    intrinsicMotivation: "",
    extrinsicMotivation: "",
    progress: "",
  });
  
  const [addsubGoalData, setsubGoalData] = useState({
    subgoal: "",
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

    setGoalList(current => [...current,addGoalData.goal]);

    const newGoals = [...goals, newGoal];
    if(goalRef.current.value != ""){
    setGoals(newGoals);
    }
    goalRef.current.value = "";
    intrinsicRef.current.value = "";
    extrinsicRef.current.value = "";
  }

  const handleDeleteGoal = (goalId) => {
    const newGoals = [...goals];

    const index = goals.findIndex((goal)=> goal.id === goalId);

    newGoals.splice(index, 1);

    setGoals(newGoals);

    GoalList.splice(index, 1);
  }

  const handlesubGoalsChange = (e) => {
    e.preventDefault();
    const subgoalName = e.target.getAttribute("name");
    const subgoalValue = e.target.value;
    const newsubGoalData = { ...addsubGoalData };
    newsubGoalData[subgoalName] = subgoalValue;
    setsubGoalData(newsubGoalData);
  }

  const handleAddNewSubGoal = (e) => {
    e.preventDefault();

    const newsubGoal = {
      id: nanoid(),
      subgoal: addsubGoalData.subgoal,
      progress: " ",
    }

    const newsubGoals = [...subgoals, newsubGoal];
    if(subgoalRef.current.value != ""){
    setsubGoals(newsubGoals);
    }
    subgoalRef.current.value = "";

  }

  const handleDeletesubGoal = (subgoalId) => {
    const newsubGoals = [...subgoals];

    const index = subgoals.findIndex((subgoal)=> subgoal.id === subgoalId);

    newsubGoals.splice(index, 1);

    setsubGoals(newsubGoals);

  }
  

  return (
    <div>
      <h1>Welcome to your home page!</h1>
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
        <IconButton type="submit" icon={<PlusIcon />} appearance="primary" color="green">Create</IconButton>
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

          

        <form onSubmit={handleAddNewSubGoal}>
      <label>
            SubGoal:
          </label>
          <input
            type="input"
            name="subgoal"
            placeholder="Enter your tasks for this goal..."
            ref={subgoalRef}
            className="form-control"
            onChange={handlesubGoalsChange}
          />
          
          <IconButton type="submit" icon={<PlusIcon />} appearance="primary" color="cyan">Create</IconButton>
          </form>
          
          <table id="subgoals-table" className="table mt-5">
      <thead>
        <tr>
          <th scope="col">Tasks</th>
          <th scope="col">Goal</th>
          <th scope="col">Progress</th>
        </tr>
        
      </thead>
          
      <tbody id="subgoals-table-body">
        {subgoals.map((newsubGoal)=> (
          <SubGoal props={newsubGoal} key={newsubGoal.id} list={GoalList} handleDeletesubGoal={handleDeletesubGoal}/>
        ))}
      </tbody>
        </table>
    </div>
  )
}