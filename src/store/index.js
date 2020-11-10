import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { db } from "../firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sessions: {},
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
      console.log("asdasdf");
      return bindFirestoreRef(
        "sessions",
        db.collection("sessions").orderBy("startTime")
      );
    })
  },
  modules: {}
});
