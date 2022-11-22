//SendGrid Config
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');
const {Timestamp} = require("firebase-admin/firestore");
// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

const sgMail = require('@sendgrid/mail');
const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

exports.scheduledFunction = functions.pubsub.schedule('every 2 minutes').onRun (async (context) => {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}-${month}-${day}`;

  //const db = admin.firestore();
  const emails = [];
  var goal = "";
  var extrinsic = "";
  var intrinsic = "";
  var email = "";
  
  var query = await admin.firestore().collectionGroup('goals').where("reminderDate", "==", currentDate).get();
  for (const doc of query.docs) {
    const data = doc.data();
    console.log(doc.id, data);
    goal = data.goal;
    console.log(typeof(goal));
    console.log("goal: " + goal);
    console.log("current reminder date: " + data.reminderDate);
    const currReminderDateTimestamp = Timestamp.fromDate(new Date(data.reminderDate));
    console.log(currReminderDateTimestamp);
    console.log(typeof(currReminderDateTimestamp));
    const currReminderDateMillis = Timestamp.toMillis(currReminderDateTimestamp.seconds);
    const oneWeekMillis = 604800000;
    const newReminderDateMillis = currReminderDateMillis + oneWeekMillis;
    const newReminderDateTimestamp = Timestamp.fromMillis(newReminderDateMillis);
    const newReminderDate = Timestamp.toDate(newReminderDateTimestamp);
    console.log(newReminderDate);


    extrinsic = data.extrinsicMotivation;
    console.log("extrinsic: " + extrinsic);
    intrinsic = data.intrinsicMotivation;
    console.log("intrinsic: " + intrinsic);
    // set the reminderDate to the new reminderDate
    const path = doc.ref.path;
    const uid = path.split('/')[1];
    console.log(uid);
    email = (await admin.auth().getUser(uid)).email;
    console.log(typeof(email));
    console.log(email);
    emails.push(email);

    var msg = {
      to: email,
      from: 'tjchu@ucsc.edu',
      templateId: TEMPLATE_ID,
      dynamic_template_data: {
        'name': email,
        'goal': goal,
        'extrinsic': intrinsic,
        'intrinsic': extrinsic,
      },
    };
    
    console.log(msg);
    console.log('This will run every day at 22:22');
    console.log(context);
    sgMail.send(msg);
  }
  console.log(emails);
});



