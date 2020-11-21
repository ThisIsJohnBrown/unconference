import { auth, db } from "../firebase";
import { string_to_slug } from "@/helpers";

async function bindSession(context, slug) {
  console.log(context.state.conference.id, slug);
  return await context.bindFirestoreRef(
    "session",
    db
      .collection(`conferences/${context.state.conference.id}/sessions`)
      .where("slug", "==", slug)
      .limit(1)
  );
}

async function bindSessionCreator(context, id) {
  console.log(id);
  return await context.bindFirestoreRef(
    "sessionCreator",
    db.collection("users").doc(id)
  );
}

async function addSession(context, payload) {
  try {
    const uid = auth.currentUser.uid;
    return await db
      .collection(`conferences/${context.state.conference.id}/sessions`)
      .add({
        ...payload,
        slug: `${string_to_slug(payload.title)}-${uid.slice(0, 6)}`,
        created_by: uid
      });
  } catch (error) {
    console.warn(error.message);
  }
}
function deleteSession(context, payload) {
  db.collection(`conferences/${context.state.conference.id}/sessions`)
    .doc(payload)
    .delete();
}
function updateSession(context, payload) {
  db.collection(`conferences/${context.state.conference.id}/sessions`)
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
