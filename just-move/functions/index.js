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

exports.scheduledFunction = functions.pubsub.schedule('every day 14:50').onRun((context) => {
  var msg = {
    to: 'tristan8chu@gmail.com',
    from: 'tjchu@ucsc.edu',
    templateId: TEMPLATE_ID,
    dynamic_template_data: {
      extrinsic: 'extrinsic motivation',
      intrinsic: 'intrinsic motivation',
    },
  };
  console.log(msg);
  console.log('This will run every day at 14:50');
  console.log(context);
  return sgMail.send(msg);
});



