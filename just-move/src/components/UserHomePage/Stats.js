import React from "react";
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { FlexboxGrid } from "rsuite";
import { homepageTextColor, homepageDarkTextColor } from "./UserHomePage";

const oneWeekMillis = 604800000;

export function Stats(props) {

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}-${month}-${day}`;
  const currentDateTimestamp = Timestamp.fromDate(new Date(currentDate));
  const currentDateMillis = currentDateTimestamp.toMillis();
  const sevenDaysAgoMillis = currentDateMillis - oneWeekMillis;

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

  return ((gs.length) ? <FlexboxGrid className="alert" id="statsDisplay" style={{ color: props.darkMode ? homepageDarkTextColor : homepageTextColor }}>
    <FlexboxGrid.Item colspan={sgs.length ? 8 : 12}>
      <h6>This week, you worked on {gs.length} goal{gs.length == 1 ? "" : "s"}.</h6>
    </FlexboxGrid.Item>
    {sgs.length ? <FlexboxGrid.Item colspan={8}>
      <h6>You completed {sgs.length} subgoal{sgs.length == 1 ? "" : "s"}.</h6>
    </FlexboxGrid.Item> : ""}
    <FlexboxGrid.Item colspan={sgs.length ? 8 : 12}>
      <h6>Goals: {gs.join(", ")}</h6>
    </FlexboxGrid.Item>
    {/* <FlexboxGrid.Item colspan={1}>
      <button className="" style={{
        border: "2px", color: props.darkMode ? homepageDarkTextColor : homepageTextColor, background: props.darkMode ? "#202124" : "white",
      }} onClick={props.setDismissed}><b className="bi bi-x-circle-fill"></b></button>
    </FlexboxGrid.Item> */}
  </FlexboxGrid> : "");
}

