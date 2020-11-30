import { firestoreAction } from "vuexfire";
import { auth, db } from "@/firebase";
import { string_to_slug } from "@/helpers";

export default {
  namespaced: true,
  state: {
    sessions: {}
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
      }
    ),
    addSession: async (context, payload) => {
      try {
        const uid = auth.currentUser.uid;
        db.collection(
          `conferences/${context.rootState.conferences.conference.id}/sessions`
        ).add({
          ...payload,
          slug: `${string_to_slug(payload.title)}-${uid.slice(0, 6)}`
        });
      } catch (error) {
        console.log(error.message);
      }
    },
    updateSession: (context, payload) => {
      db.collection(
        `conferences/${context.rootState.conferences.conference.id}/sessions`
      )
        .doc(payload.id)
        .set(Object.assign({}, payload.data), { merge: true });
    },
    deleteSession: (context, payload) => {
      db.collection(
        `conferences/${context.rootState.conferences.conference.id}/sessions`
      )
        .doc(payload)
        .delete();
    }
  },
  mutations: {}
};
