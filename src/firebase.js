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

const register = async data => {
  try {
    const user = await firebase
      .auth()
      .createUserWithEmailAndPassword(data.email, data.password);
    return {
      success: true,
      data: user
    };
  } catch (error) {
    return {
      success: false,
      data: { error }
    };
  }
};

const googleLogin = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  return await firebase.auth().signInWithPopup(provider);
};

const logout = () => {
  firebase.auth().signOut();
};

export { auth, db, TimeStamp, googleLogin, logout, register };
