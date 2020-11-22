const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.updateSessionDetailsOnUserUpdate = functions.firestore
  .document("users/{userId}")
  .onUpdate(async (change, context) => {
    // console.log(change.after);
    if (change.before.data().displayName !== change.after.data().displayName) {
      // change.after.id
      const sessions = await db
        .collection(`conferences/${conference}/sessions`)
        .where("created_by.id", "==", change.after.id)
        .get();
      sessions.docs.forEach(doc => {
        console.log(doc.id);
        db.collection(`conferences/${conference}/sessions`)
          .doc(doc.id)
          .set(
            {
              created_by: {
                displayName: change.after.data().displayName
              }
            },
            { merge: true }
          );
      });
    }
  });
