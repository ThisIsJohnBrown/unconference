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

export { auth, db, TimeStamp };
