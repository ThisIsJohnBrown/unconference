import { auth, db } from "../firebase";
import { string_to_slug } from "@/helpers";

async function bindSession(bindFirestoreRef, slug) {
  return await bindFirestoreRef(
    "session",
    db
      .collection("sessions")
      .where("slug", "==", slug)
      .limit(1)
  );
}

async function bindSessionCreator(bindFirestoreRef, id) {
  console.log(id);
  return await bindFirestoreRef(
    "sessionCreator",
    db.collection("users").doc(id)
  );
}

async function addSession(context, payload) {
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
}
function deleteSession(context, payload) {
  db.collection("sessions")
    .doc(payload)
    .delete();
}
function updateSession(context, payload) {
  db.collection("sessions")
    .doc(payload.id)
    .set(payload.data, { merge: true });
}

export {
  bindSession,
  bindSessionCreator,
  addSession,
  deleteSession,
  updateSession
};
