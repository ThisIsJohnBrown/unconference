import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { db } from "../firebase";
import { bindSession } from "./sessionActions";
import modules from "./modules";

Vue.config.devtools = true; //process.env.NODE_ENV === 'development'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    session: {},
    hands: [],
    questions: []
  },
  modules,
  mutations: {
    ...vuexfireMutations
  },
  actions: {
    bindSession: firestoreAction(async (context, slug) => {
      let sessions;
      try {
        sessions = bindSession(context, slug);
      } catch (error) {
        console.error(error.message);
      }
      return sessions;
    }),
    bindAdminSession: firestoreAction(async context => {
      context.bindFirestoreRef(
        "hands",
        db.collection(
          `conferences/${context.state.conferences.conference.id}/sessions/${context.state.session[0].id}/hands`
        )
      );
      context.bindFirestoreRef(
        "questions",
        db.collection(
          `conferences/${context.state.conferences.conference.id}/sessions/${context.state.session[0].id}/questions`
        )
      );
    }),
    addQuestion: (context, question) => {
      db.collection(
        `conferences/${context.state.conferences.conference.id}/sessions/${context.state.session[0].id}/questions`
      )
        .doc(context.state.userDetails.id)
        .set({ ...question });
    },
    deleteQuestion: (context, id) => {
      db.collection(
        `conferences/${context.state.conferences.conference.id}/sessions/${context.state.session[0].id}/questions`
      )
        .doc(id)
        .set({ deleted: true }, { merge: true });
    },
    addRaisedHand: (context, raisedHand) => {
      db.collection(
        `conferences/${context.state.conferences.conference.id}/sessions/${context.state.session[0].id}/hands`
      )
        .doc(context.state.userDetails.id)
        .set({ ...raisedHand });
    },
    lowerHand: (context, id) => {
      db.collection(
        `conferences/${context.state.conferences.conference.id}/sessions/${context.state.session[0].id}/hands`
      )
        .doc(id)
        .set({ raised: false }, { merge: true });
    }
  }
});
