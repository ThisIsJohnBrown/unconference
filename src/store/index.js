import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { auth, db } from "../firebase";
import { string_to_slug } from "@/helpers";

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
    }),
    addSession: firestoreAction(async (context, payload) => {
      try {
        const uid = auth.currentUser.uid;
        return await db.collection("sessions").add({
          ...payload,
          slug: `${string_to_slug(payload.title)}-${uid.slice(0, 6)}`,
          created_by: uid
        });
      } catch (error) {
        console.warn(error.message);
      }
    })
  },
  modules: {}
});
