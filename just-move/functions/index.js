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
  var query = await admin.firestore().collectionGroup('goals').where("reminderDate", "==", currentDate).get();
  for (const doc of query.docs) {
    console.log(doc.id, doc.data());
    const path = doc.ref.path;
    const uid = path.split('/')[1];
    console.log(uid);
    const email = (await admin.auth().getUser(uid)).email;
    console.log(email);
    emails.push(email);
  }
  console.log(emails);

  var msg = {
    to: emails,
    from: 'tjchu@ucsc.edu',
    templateId: TEMPLATE_ID,
    dynamic_template_data: {
      extrinsic: 'extrinsic motivation',
      intrinsic: 'intrinsic motivation',
    },
  };
  
  console.log(msg);
  console.log('This will run every day at 22:22');
  console.log(context);
  return sgMail.send(msg);
});



