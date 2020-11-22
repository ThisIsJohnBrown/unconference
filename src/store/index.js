import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { db } from "../firebase";
import { unique } from "@/helpers";
import {
  addSession,
  bindSession,
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
    watchedSessions: [],
    ownedSessions: [],
    conference: {}
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
    },
    updateOwned(state, payload) {
      state.ownedSessions = payload.owned;
    }
  },
  actions: {
    bindSessions: firestoreAction(
      async ({ bindFirestoreRef }, conferenceId) => {
        const data = await bindFirestoreRef(
          "sessions",
          db
            .collection(`conferences/${conferenceId}/sessions`)
            .orderBy("startTime")
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
      }
    ),
    bindSessionCreators: firestoreAction(async ({ bindFirestoreRef }) => {
      const data = await bindFirestoreRef(
        "sessionCreators",
        db.collection("users")
      );
      return data;
    }),
    bindConference: firestoreAction(async ({ bindFirestoreRef }, id) => {
      try {
        const data = await bindFirestoreRef(
          "conference",
          db.collection("conferences").doc(id)
        );
        return data;
      } catch (error) {
        console.error(error.message);
      }
    }),
    bindSession: firestoreAction(async (context, slug) => {
      try {
        await bindSession(context, slug);
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
      const sessionCollection = db.collection(
        `conferences/${context.state.conference.id}/sessions`
      );
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
      const owned = await db
        .collection(`conferences/${context.state.conference.id}/sessions`)
        .where("created_by.id", "==", id)
        .get();
      context.commit("updateOwned", {
        owned: owned.docs.map(v => {
          let owned = v.data();
          owned.id = v.id;
          return owned;
        })
      });

      return user;
    }),
    addQuestion: (context, question) => {
      let questions = context.state.session[0].questions.length
        ? [...context.state.session[0].questions]
        : [];
      questions.push(question);
      updateSession(context, context.state.conference.id, {
        id: context.state.session[0].id,
        data: {
          questions: questions
        }
      });
    },
    addRaisedHand: (context, raisedHand) => {
      let handsRaised = context.state.session[0].handsRaised.length
        ? [...context.state.session[0].handsRaised]
        : [];
      if (handsRaised.length) {
        const index = handsRaised.reduce(hand => raisedHand.user === hand.user);
        console.log(index);
      } else {
        handsRaised.push(raisedHand);
        updateSession(context, context.state.conference.id, {
          id: context.state.session[0].id,
          data: {
            handsRaised
          }
        });
      }
    },
    removeRaisedHand: (context, id) => {
      let handsRaised = context.state.session[0].handsRaised.length
        ? [...context.state.session[0].handsRaised]
        : [];
      if (handsRaised.length) {
        let index = -1;
        handsRaised.forEach((hand, i) => {
          if (id === hand.user) {
            index = i;
          }
        });
        if (index !== -1) {
          handsRaised.splice(index, 1);
          updateSession(context, context.state.conference.id, {
            id: context.state.session[0].id,
            data: {
              handsRaised
            }
          });
        }
      }
    },
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
    updateJoined: (context, payload) => {
      let joined = [...context.state.userDetails.joined];
      const index = joined.indexOf(payload.id);
      if (index === -1) {
        joined.push(payload.id);
      } else {
        joined.splice(index, 1);
      }
      db.collection("users")
        .doc(context.state.userDetails.id)
        .set({ joined }, { merge: true });
    },
    bindProfileDetails: firestoreAction(async ({ bindFirestoreRef }, data) => {
      const user = await bindFirestoreRef(
        "profileDetails",
        db.collection("users").where("username", "==", data.username)
      );
      return user;
    }),
    updateDetails: (context, payload) => {
      db.collection("users")
        .doc(context.state.userDetails.id)
        .set(payload, { merge: true });
    }
  },
  modules: {}
});
