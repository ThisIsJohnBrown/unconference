const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.updateSessionDetailsOnUserUpdate = functions.firestore
  .document("users/{userId}")
  .onUpdate(async (change, context) => {
    if (change.before.data().displayName !== change.after.data().displayName) {
      const conferences = await admin
        .firestore()
        .collection(`conferences`)
        .get();
      conferences.docs.forEach(async con => {
        const sessions = await admin
          .firestore()
          .collection(`conferences/${con.id}/sessions`)
          .where("created_by.id", "==", change.after.id)
          .get();
        sessions.docs.forEach(doc => {
          admin
            .firestore()
            .collection(`conferences/${con.id}/sessions`)
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
      });
    }
  });
