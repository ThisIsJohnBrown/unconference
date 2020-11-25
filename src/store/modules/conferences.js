import { firestoreAction } from "vuexfire";
import { db } from "@/firebase";

export default {
  namespaced: true,
  state: {
    conference: {}
  },
  actions: {
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
    })
  },
  mutations: {}
};
