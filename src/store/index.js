import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { db } from "../firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sessions: {}
  },
  mutations: { ...vuexfireMutations },
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
