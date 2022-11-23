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

exports.scheduledFunction = functions.pubsub.schedule('every day 14:00').onRun (async (context) => {
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
    const currReminderDateTimestamp = Timestamp.fromDate(new Date(data.reminderDate));
    const currReminderDateMillis = currReminderDateTimestamp.toMillis();
    const oneWeekMillis = 604800000;
    const newReminderDateMillis = currReminderDateMillis + oneWeekMillis;
    const newReminderDateTimestamp = Timestamp.fromMillis(newReminderDateMillis);
    const newReminderDate = newReminderDateTimestamp.toDate(); 
    const newReminderDateString = newReminderDate.toISOString().substring(0, 10);

    // update the reminderDate to the current date + 7 days
    docRef.update({reminderDate: newReminderDateString}).then(res => {
      console.log(`Document updated at ${res.updateTime}`);
    });

    // get the goal data and pass it into the email
    extrinsic = data.extrinsicMotivation;
    intrinsic = data.intrinsicMotivation;
    
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
    console.log(context);
    sgMail.send(msg);
  }
});



