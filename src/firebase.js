import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

const fb = firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIRESTORE_API_KEY,
  authDomain: process.env.VUE_APP_FIRESTORE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIRESTORE_PROJECT_ID,
  appId: process.env.VUE_APP_FIRESTORE_APP_ID,
  storageBucket: process.env.VUE_APP_FIRESTORE_STORAGE_BUCKET
});

const db = fb.firestore();
const storage = fb.storage();
const TimeStamp = firebase.firestore.Timestamp;
const FieldPath = firebase.firestore.FieldPath;
const auth = firebase.auth();

let dbSettings = {
  timestampsInSnapshots: true
};
if (process.env.VUE_APP_FIREBASE_EMULATOR === "true") {
  dbSettings.host = "localhost:8080";
  dbSettings.ssl = false;
}
db.settings(dbSettings);

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
    const userData = {
      displayName: data.displayName,
      email: data.email,
      username: data.username,
      verified: false,
      avatar: `https://robohash.org/${data.username}.jpg`,
      watched: [],
      joined: [],
      social: {
        github: "",
        homepage: "",
        linkedin: "",
        twitter: "",
        instagram: ""
      },
      uid: newUser.user.uid
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
  const username = data.user.email.slice(0, data.user.email.indexOf("@"));
  const userData = {
    displayName: data.user.displayName,
    email: data.user.email,
    username,
    verified: false,
    avatar: `https://robohash.org/${username}.jpg`,
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
  FieldPath,
  googleLogin,
  emailPasswordLogin,
  logout,
  register,
  storage
};
