// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');
const {Timestamp} = require("firebase/firestore");
const {getFirestore} = require("firebase-admin/firestore");

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
const app = admin.initializeApp();
const db = getFirestore(app);

//SendGrid Config
const sgMail = require('@sendgrid/mail');
const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

//global vars
const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${year}-${month}-${day}`;
const currDateTimestamp = Timestamp.fromDate(new Date(currentDate));
const currDateMillis = currDateTimestamp.toMillis();
const oneWeekMillis = 604800000;
const newReminderDateMillis = currDateMillis + oneWeekMillis;
const sevenDaysAgoMillis = currDateMillis - oneWeekMillis;
var goal = "";
var email = "";

exports.reminderEmail = functions.pubsub.schedule('every day 14:00').onRun (async (context) => {
  const emails = [];  
  
  var query = await admin.firestore().collectionGroup('goals').where("reminderDate", "==", currentDate).get();
  for (const goalDoc of query.docs) {
    const data = goalDoc.data();
    console.log(data);

    // get the email of the user
    const path = goalDoc.ref.path;
    const uid = path.split('/')[1];
    email = (await admin.auth().getUser(uid)).email;
    emails.push(email);

    // get a DocumentReference so we can update it later
    const docRef = db.doc(path);

    goal = data.goal;
    // set the reminderDate to the new reminderDate
    const newReminderDateTimestamp = Timestamp.fromMillis(newReminderDateMillis);
    const newReminderDate = newReminderDateTimestamp.toDate(); 
    const newReminderDateString = newReminderDate.toISOString().substring(0, 10);

    // update the reminderDate to the current date + 7 days
    docRef.update({reminderDate: newReminderDateString}).then(res => {
      console.log(`Document updated at ${res.updateTime}`);
    });

    // get the goal data and pass it into the email
    const extrinsic = data.extrinsicMotivation;
    const intrinsic = data.intrinsicMotivation;
    
    const emailText = "Just wanted to remind you why you started working on: " + goal;
    const extrinsicText = "Extrinsic reason: " + extrinsic;
    const intrinsicText = "Intrinsic reason: " + intrinsic;
    const motivationText = `If you find that your goal no longer aligns with who you want to be, don't be afraid to get rid of it. We change our minds all the time and there's nothing wrong with that. Now go conquer the world and Just Move!

Note: If no progress is made for this goal within the next 7 days, another reminder will be sent! 

You got this!`

    var msg = {
      to: email,
      from: 'tjchu@ucsc.edu',
      templateId: TEMPLATE_ID,
      dynamic_template_data: {
        'name': email,
        'text': emailText,
        'firstInput': extrinsicText,
        'secondInput': intrinsicText,
        'motivation': motivationText
      },
    };
    console.log(context);
    sgMail.send(msg);
  }
});

exports.weeklySummary = functions.pubsub.schedule('every day 14:00').onRun (async (context) => {
  let query = await admin.firestore().collection('users').get();
  for (const user of query.docs) {
    const path = user.ref.path;
    const uid = path.split('/')[1];
    console.log(uid);
    email = (await admin.auth().getUser(uid)).email;
    let goalsQuery = await admin.firestore().collection('users/' + uid + '/goals').get();
    var goalList = [];
    var subgoalList = [];
    for (const goal of goalsQuery.docs) {
      const data = goal.data();
      const mostRecentDateTimestamp = Timestamp.fromDate(new Date(data.mostRecentDate));
      const mostRecentDateMillis = mostRecentDateTimestamp.toMillis();
      const mostRecentDate = mostRecentDateTimestamp.toDate();
      console.log("currDate: " + currDateMillis + " " + currentDate);
      console.log("mostRecentDate: " + mostRecentDateMillis + " " + mostRecentDate);
      console.log("7 days ago: " + sevenDaysAgoMillis + " " + Timestamp.fromMillis(sevenDaysAgoMillis).toDate());
      if (mostRecentDateMillis >= sevenDaysAgoMillis && mostRecentDateMillis <= currDateMillis) {
        console.log(data);
        goalList.push(data.goal);
        for (const subgoal of data.subgoal) {
          if (subgoal['completed'] == true) {
            console.log(subgoal['name']);
            subgoalList.push(subgoal['name']);
          }
        }
      }
    }

    console.log(goalList);

    const emailText = "These are the goals you worked towards this week and the subtasks you completed!";
    const goalListString = goalList.toString();
    const subgoalListString = subgoalList.toString();
    const goalsText = "Goals: " + goalListString;
    const subgoalsText = "Subtasks: " + subgoalListString;
    var msg = {
      to: email,
      from: 'tjchu@ucsc.edu',
      templateId: TEMPLATE_ID,
      dynamic_template_data: {
        'name': email,
        'text': emailText,
        'firstInput': goalsText,
        'secondInput': subgoalsText 
      },
    };
    sgMail.send(msg);
  }
  console.log(context);

});



