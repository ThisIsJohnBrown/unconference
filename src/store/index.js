import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { db } from "../firebase";
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
    bindSessions: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef(
        "sessions",
        db.collection("sessions").orderBy("startTime")
      );
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
