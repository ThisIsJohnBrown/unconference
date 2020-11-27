import { firestoreAction } from "vuexfire";
import { db, auth, FieldPath } from "@/firebase";

export default {
  namespaced: true,
  state: {
    user: {},
    userDetails: {},
    watched: [],
    owned: []
  },
  getters: {
    isAuthenticated: state => {
      return state.user.uid ? true : false;
    }
  },
  actions: {
    bindUser: firestoreAction(async (context, id) => {
      const user = await context.bindFirestoreRef(
        "userDetails",
        db.collection("users").doc(id)
      );
      return user;
    }),
    bindUserOwned: firestoreAction(async context => {
      await context.bindFirestoreRef(
        "owned",
        db
          .collection(
            `conferences/${context.rootState.conferences.conference.id}/sessions`
          )
          .where("created_by.id", "==", context.state.user.uid)
      );
    }),
    bindUserWatched: firestoreAction(async context => {
      await context.bindFirestoreRef(
        "watched",
        db
          .collection(
            `conferences/${context.rootState.conferences.conference.id}/sessions`
          )
          .where(
            FieldPath.documentId(),
            "in",
            context.state.userDetails.watched
          )
      );
    }),
    updateWatched: (context, payload) => {
      let watched;
      let fullWatched = [...context.state.watched];
      try {
        watched = context.state.watched.map(s => s.id);
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
    },
    emailPasswordLogin: async (context, data) => {
      return await auth.signInWithEmailAndPassword(data.email, data.password);
    },
    logout: () => {
      auth.signOut();
    }
  },
  mutations: {
    loginUser(state, payload) {
      state.user = payload.user;
    },
    logoutUser(state) {
      state.user = {};
    },
    updateWatched(state, payload) {
      state.watched = payload.watched;
    },
    updateOwned(state, payload) {
      state.ownedSessions = payload.owned;
    }
  }
};
