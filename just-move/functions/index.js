//SendGrid Config
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

const sgMail = require('@sendgrid/mail');
const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

exports.scheduledFunction = functions.pubsub.schedule('every day 14:00').onRun (async (context) => {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${month}-${day}-${year}`;

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
  }
  console.log(emails);

  var msg = {
    to: emails,
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
  return sgMail.send(msg);
});



