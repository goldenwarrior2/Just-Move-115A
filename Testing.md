# Testing

## Goal saving

Equivalence classes:

- User is not logged in
- User is logged in, internet connected
- User is logged in with internet instability

In the first two cases, we start with no goals. Then we add some goals and refresh to ensure it is remembered.
We then edit a goal, refresh, and ensure it is edited. We then delete a goal, refresh, and ensure it is deleted.

For the third equivalence class, we do the same three tests as above but disconnect the network connection before each step. We then reconnect after the refresh is interrupted, refresh, and ensure that the data was saved after all.

## Priority

Equivalence classes:

- Adding priority through goal add
- Editing priority
- Editing without changing priority
- Modify subgoal state

For the first one, we add a new goal with a priority (two tests, zero and non-zero) and ensure that the priority is properly saved and displayed, even after a refresh.

For the second test, we edit an existing goal to change the priority and ensure the changes are correct, even after a refresh.
For the third test, we edit something other than priority and ensure that priority is not modified, even after a refresh.

For the fourth test, we modify the state of a subgoal, which causes an internal edit and save. We ensure that the priority remains the same after a refresh.

## Sorting

Equivalence classes:

- Start date sorting, ascending
- Start date sorting, descending
- Priority sorting, ascending
- Priority sorting, descending
- Progress sorting, ascending
- Progress sorting, descending
- User logged in
- User logged out

For each test, we assume that we have multiple goals, some of which differ and some of which are the same with regard to the comparator used in the given sort. All tests assume the filters tab is open.

To test the first two classes, click on the "Start Date" button. It should change to show a down arrow, and the goal list should be sorted by start date descending. If goals were created on the same date, they will go by order created. Click on "Start Date" again and it will change to an up arrow, and goals will be sorted by start date ascending.

The second two classses are tested similarly. When descending, priority should go from ---- to = to ++++. Ascending is this reversed.

The third two are also tested similarly, except that on first click the goals should be sorted ascending, and then descending on the second click. Goals will be sorted by the percentage shown in the progress bar.

The last two tests are done by setting a sort method to something other than start date ascending (the default) and then refreshing the page. The last used sort should be remembered and used.

## Stats

Equivalence classes:

- No goals exist
- Goals exist but have not been recently worked on
- Goals have been recently worked on, but subgoals have not
- Goals and subgoals have been recently worked on

Testing the first equivalence class is trivial to do by deleting all the goals.
Testing for the third equivalence class is also easy, as creating a goal counts as "recent work" to the program. To test the second equivalence class, the dates should be modified to be at least a week old.
Testing for the fourth equivalence class requires adding subgoals and completing them.

An additional test for the third equivalence class is to add subgoals, but not complete any of them. This should behave the same as not adding any for the purpose of testing.

An additional test for the second equivalence class is to add subgoals, complete some, and then change the dates so that they are more than a week old.

An additional test for the fourth equivalence class is to work with more than one goal and then delete one of them to make sure the statistics only account for goals that have not been deleted.

### Dark mode

Equivalence classes:

- Logged in, starting in light mode
- Logged in, starting in dark mode
- Not logged in, starting in light mode
- Not logged in, starting in dark mode

Due to the simplicity of the features, the setup for the tests is rather evident.

For each class, the mode was toggled to ensure that the transtion affected what it was intended to. The page was then refreshed to ensure that the change was persistent.
