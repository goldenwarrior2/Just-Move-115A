import React from "react";
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { FlexboxGrid } from "rsuite";
import { homepageTextColor, homepageDarkTextColor } from "./UserHomePage";

const oneWeekMillis = 604800000;

export function Stats(props) {
  const [goalList, setGoalList] = useState([]);
  const [subgoalList, setSubGoalList] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}-${month}-${day}`;
  const currentDateTimestamp = Timestamp.fromDate(new Date(currentDate));
  const currentDateMillis = currentDateTimestamp.toMillis();
  const sevenDaysAgoMillis = currentDateMillis - oneWeekMillis;

  if (!loaded) {
    const sgs = [];
    const gs = [];
    for (const goal of props.goals) {
      const mostRecentDateTimestamp = Timestamp.fromDate(new Date(goal.mostRecentDate));
      const mostRecentDateMillis = mostRecentDateTimestamp.toMillis();
      if (mostRecentDateMillis >= sevenDaysAgoMillis && mostRecentDateMillis <= currentDateMillis) {
        gs.push(goal.goal);
        for (const subgoal of goal.subgoal) {
          if (subgoal['completed'] == true) {
            sgs.push(subgoal['name']);
          }
        }
      }
    }

    console.log(gs.length);
    console.log(sgs.length);
    console.log(gs);
    console.log(sgs);

    setGoalList(gs);
    setSubGoalList(sgs);
    setLoaded(true);
  }
  return ((loaded && !dismissed && goalList.length) ? <FlexboxGrid className="alert" id="statsDisplay" style={{ color: props.darkMode ? homepageDarkTextColor : homepageTextColor }}>
    <FlexboxGrid.Item colspan={1}> </FlexboxGrid.Item>
    <FlexboxGrid.Item colspan={7}>
      <h6>This week, you worked on {goalList.length} goal{goalList.length == 1 ? "" : "s"}.</h6>
    </FlexboxGrid.Item>
    <FlexboxGrid.Item colspan={7}>
      <h6>You completed {subgoalList.length} subgoal{subgoalList.length == 1 ? "" : "s"}.</h6>
    </FlexboxGrid.Item>
    <FlexboxGrid.Item colspan={8}>
      <h6>Goals: {goalList.join(", ")}</h6>
    </FlexboxGrid.Item>
    {/* <FlexboxGrid.Item colspan={7}>
      {subgoalList.length ? <p>Subgoals: {subgoalList.join(", ")}</p> : ""}
    </FlexboxGrid.Item> */}
    <FlexboxGrid.Item colspan={1}>
      <button className="" style={{
        border: "2px", color: props.darkMode ? homepageDarkTextColor : homepageTextColor, background: "#202124"
      }} onClick={() => setDismissed(true)}><b className="bi bi-x-circle-fill"></b></button>
    </FlexboxGrid.Item>
  </FlexboxGrid> : "");
}

