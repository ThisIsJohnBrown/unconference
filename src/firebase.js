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
      avatar: `https://www.tinygraphs.com/squares/${displayName}?theme=base&numcolors=2&size=220.png`
    };
    db.collection("users")
      .doc(newUser.user.uid)
      .set(userData);
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
  return await firebase.auth().signInWithPopup(provider);
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
