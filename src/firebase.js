import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

const fb = firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIRESTORE_API_KEY,
  authDomain: process.env.VUE_APP_FIRESTORE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIRESTORE_DATABASEURL,
  projectId: process.env.VUE_APP_FIRESTORE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIRESTORE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIRESTORE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIRESTORE_APP_ID,
  measurementId: process.env.VUE_APP_FIRESTORE_MEASUREMENT_ID
});
fb.analytics();

const db = fb.firestore();
const TimeStamp = firebase.firestore.Timestamp;
const auth = firebase.auth();

db.settings({ timestampsInSnapshots: true });

const register = async data => {
  try {
    const usernameSnapshot = await db
      .collection("users")
      .where("username", "==", data.username)
      .get();
    if (!usernameSnapshot.empty) {
      return {
        success: false,
        data: {
          error: {
            message: "Please choose a unique username"
          }
        }
      };
    }
    const newUser = await firebase
      .auth()
      .createUserWithEmailAndPassword(data.email, data.password);
    const displayName = data.email.slice(0, data.email.indexOf("@"));
    const userData = {
      displayName,
      email: data.email,
      username: data.username,
      verified: false,
      avatar: `https://www.tinygraphs.com/squares/${displayName}?theme=base&numcolors=2&size=220.png`,
      watched: [],
      joined: []
    };
    try {
      await db
        .collection("users")
        .doc(newUser.user.uid)
        .set(userData);
    } catch (error) {
      console.error(error.message);
    }
    return {
      success: true,
      data: newUser
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
  const data = await firebase.auth().signInWithPopup(provider);
  const userData = {
    displayName: data.user.displayName,
    email: data.user.email,
    username: data.user.email.slice(0, data.user.email.indexOf("@")),
    verified: false,
    avatar: `https://www.tinygraphs.com/squares/${data.user.displayName}?theme=base&numcolors=2&size=220.png`,
    watched: [],
    joined: []
  };
  try {
    await db
      .collection("users")
      .doc(data.user.uid)
      .set(userData);
  } catch (error) {
    console.error(error.message);
  }
  return data;
};

const emailPasswordLogin = async data => {
  return firebase.auth().signInWithEmailAndPassword(data.email, data.password);
};

const logout = () => {
  firebase.auth().signOut();
};

export {
  auth,
  db,
  TimeStamp,
  googleLogin,
  emailPasswordLogin,
  logout,
  register
};
