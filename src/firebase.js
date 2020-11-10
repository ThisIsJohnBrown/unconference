import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";
const { config } = require("../firebase.config");

const fb = firebase.initializeApp(config);
fb.analytics();

const db = fb.firestore();
const TimeStamp = firebase.firestore.Timestamp;
const auth = firebase.auth();

db.settings({ timestampsInSnapshots: true });

const googleLogin = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      console.log(result);
    })
    .catch(function(error) {
      console.error(error.message);
    });
};

const logout = () => {
  firebase
    .auth()
    .signOut()
    .then(function() {})
    .catch(function(error) {
      console.error(error.message);
    });
};

export { auth, db, TimeStamp, googleLogin, logout };
