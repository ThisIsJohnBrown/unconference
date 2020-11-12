import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { db } from "../firebase";
import { unique } from "@/helpers";
import {
  addSession,
  bindSession,
  bindSessionCreator,
  deleteSession,
  updateSession
} from "./sessionActions";

Vue.config.devtools = true; //process.env.NODE_ENV === 'development'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sessions: {},
    session: {},
    sessionCreator: {},
    sessionCreators: {},
    user: {},
    userDetails: {},
    profileDetails: {},
    watchedSessions: []
  },
  mutations: {
    ...vuexfireMutations,
    loginUser(state, payload) {
      state.user = payload.user;
    },
    logoutUser(state) {
      state.user = {};
    },
    updateWatched(state, payload) {
      state.watchedSessions = payload.watched;
    }
  },
  actions: {
    bindSessions: firestoreAction(async ({ bindFirestoreRef }) => {
      const data = await bindFirestoreRef(
        "sessions",
        db.collection("sessions").orderBy("startTime")
      );
      return data;

      // THIS IS AN IDEA to map the users to the sessions, but might not be the right way to go about it.

      // const userCollection = db.collection("users");
      // const users = data.map(d => d.created_by).filter(unique);
      // const userReads = users
      //   .map(d => {
      //     return userCollection.doc(d).get();
      //   })
      //   .filter(unique);
      // const result = await Promise.all(userReads);
      // this.sessionCreators = result.map(v => v.data());
    }),
    bindSessionCreators: firestoreAction(async ({ bindFirestoreRef }) => {
      const data = await bindFirestoreRef(
        "sessionCreators",
        db.collection("users")
      );
      return data;
    }),
    bindSession: firestoreAction(async ({ bindFirestoreRef }, slug) => {
      try {
        const session = await bindSession(bindFirestoreRef, slug);
        await bindSessionCreator(bindFirestoreRef, session[0].created_by.user);
      } catch (error) {
        console.error(error.message);
      }
    }),
    addSession: firestoreAction((c, p) => addSession(c, p)),
    updateSession: firestoreAction((c, p) => updateSession(c, p)),
    deleteSession: firestoreAction((c, p) => deleteSession(c, p)),
    bindUser: firestoreAction(async (context, id) => {
      const user = await context.bindFirestoreRef(
        "userDetails",
        db.collection("users").doc(id)
      );
      const sessionCollection = db.collection("sessions");
      const watchedSessions = user.watched.filter(unique);
      const sessionReads = watchedSessions
        .map(d => {
          return sessionCollection.doc(d).get();
        })
        .filter(unique);
      const result = await Promise.all(sessionReads);
      context.commit("updateWatched", {
        watched: result.map(v => {
          let watch = v.data();
          watch.id = v.id;
          return watch;
        })
      });

      return user;
    }),
    updateWatched: (context, payload) => {
      let watched;
      let fullWatched = [...context.state.watchedSessions];
      try {
        watched = context.state.watchedSessions.map(s => s.id);
      } catch (error) {
        console.error(error.message);
      }
      const index = watched.indexOf(payload.session.id);
      if (index === -1) {
        watched.push(payload.session.id);
        fullWatched.push(payload.session);
      } else {
        watched.splice(index, 1);
        fullWatched = fullWatched.filter(s => s.id !== payload.session.id);
      }
      db.collection("users")
        .doc(context.state.userDetails.id)
        .set({ watched }, { merge: true });
      context.commit({
        type: "updateWatched",
        watched: fullWatched
      });
    },
    bindProfileDetails: firestoreAction(async ({ bindFirestoreRef }, data) => {
      const user = await bindFirestoreRef(
        "profileDetails",
        db.collection("users").where("username", "==", data.username)
      );
      return user;
    })
  },
  modules: {}
});
