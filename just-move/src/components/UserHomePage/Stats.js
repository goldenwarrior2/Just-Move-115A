export function Stats (props) {
  var numGoals = 0;
  var numSubgoals = 0;
  var goalList = [];
  var subgoalList = [];

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}-${month}-${day}`;

  for (const goal of props.goals) {
    const { Timestamp } = require("firebase/firestore");
    const oneWeekMillis = 604800000;
    const currentDateTimestamp = Timestamp.fromDate(new Date(currentDate));
    const currentDateMillis = currentDateTimestamp.toMillis();
    const mostRecentDateTimestamp = Timestamp.fromDate(new Date(goal.mostRecentDate));
    const mostRecentDateMillis = mostRecentDateTimestamp.toMillis();
    const mostRecentDate = mostRecentDateTimestamp.toDate();
    const sevenDaysAgoMillis = currentDateMillis - oneWeekMillis;
    if (mostRecentDateMillis >= sevenDaysAgoMillis && mostRecentDateMillis <= currentDateMillis) {
      //console.log(goal);
      goalList.push(goal.goal);
      numGoals++;
      for (const subgoal of goal.subgoal) {
        if (subgoal['completed'] == true) {
          //console.log(subgoal['name']);
          subgoalList.push(subgoal['name']);
          numSubgoals ++;
        }
      }
    }
  }
  console.log(numGoals);
  console.log(numSubgoals);
  console.log(goalList);
  console.log(subgoalList);
  return (
    ""
  )
}

