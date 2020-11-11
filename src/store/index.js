import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { db } from "../firebase";
// import { unique } from "@/helpers";
import {
  addSession,
  bindSession,
  bindSessionCreator,
  deleteSession,
  updateSession
} from "./sessionActions";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sessions: {},
    session: {},
    sessionCreator: {},
    sessionCreators: {},
    user: {}
  },
  mutations: {
    ...vuexfireMutations,
    loginUser(state, payload) {
      state.user = payload.user;
    },
    logoutUser(state) {
      state.user = {};
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
    deleteSession: firestoreAction((c, p) => deleteSession(c, p))
  },
  modules: {}
});
