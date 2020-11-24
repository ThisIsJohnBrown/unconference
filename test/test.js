/* eslint-disable no-undef */
const firebase = require("@firebase/testing");

const MY_PROJECT_ID = "vue-auth-test-d1926";
const conferenceName = "local";
const myId = "user_me";
const theirId = "user_them";
const myAuth = { uid: myId, email: "me@gmail.com" };
const theirAuth = { uid: theirId, email: "them@gmail.com" };

function getFirestore(auth) {
  const db = firebase
    .initializeTestApp({
      projectId: MY_PROJECT_ID,
      auth: auth
    })
    .firestore();
  return db;
}

beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});

async function createSession(sessionId, id) {
  const admin = getAdminFirestore();
  await admin
    .collection("conferences")
    .doc(conferenceName)
    .set({});
  await admin
    .collection(`conferences/${conferenceName}/sessions`)
    .doc(sessionId)
    .set({
      content: "before",
      created_by: {
        id: id
      }
    });
}

async function createRaisedHand(sessionId, id) {
  const admin = getAdminFirestore();
  await admin
    .collection(`conferences/${conferenceName}/sessions/${sessionId}/hands`)
    .doc(id)
    .set({
      id: id,
      content: "before"
    });
}

function getAdminFirestore() {
  const db = firebase
    .initializeAdminApp({ projectId: MY_PROJECT_ID })
    .firestore();
  return db;
}

describe("Conferences", () => {
  it("Anonymous user can read conference info", async () => {
    const db = getFirestore(null);

    const testDoc = db.collection("conferences").doc("testDoc");
    await firebase.assertSucceeds(testDoc.get());
  });

  it("Anonymous user cannot write to conferences", async () => {
    const db = getFirestore(null);

    const testDoc = db.collection("conferences").doc("testDoc");
    await firebase.assertFails(testDoc.set({ title: "test" }));
  });
});

describe("Sessions", () => {
  it("Anonymous user can read all sessions", async () => {
    const db = getFirestore(null);

    const testQuery = db.collection(`conferences/${conferenceName}/sessions`);
    await firebase.assertSucceeds(testQuery.get());
  });
  describe("Session CRUD", () => {
    it("Anonymous user cannot create a session", async () => {
      const db = getFirestore(null);

      const testDoc = db
        .collection(`conferences/${conferenceName}/sessions`)
        .doc("testSession");
      await firebase.assertFails(testDoc.set({ foo: "bar" }));
    });

    it("Registered user can create a session", async () => {
      const db = getFirestore(myAuth);
      const admin = getAdminFirestore();
      const sessionId = "session123";

      await admin
        .collection("conferences")
        .doc(conferenceName)
        .set({});
      const testDoc = db
        .collection(`conferences/${conferenceName}/sessions`)
        .doc(sessionId);
      await firebase.assertSucceeds(testDoc.set({ foo: "bar" }));
    });

    it("Registered user can update a session owned by them", async () => {
      const sessionId = "session123";
      await createSession(sessionId, myId);

      const db = getFirestore(myAuth);
      const testDoc = db
        .collection(`conferences/${conferenceName}/sessions`)
        .doc(sessionId);
      await firebase.assertSucceeds(testDoc.update({ content: "after" }));
    });

    it("Registered user cannot update a session owned by another user", async () => {
      const sessionId = "session123";
      await createSession(sessionId, myId);

      const db = getFirestore(theirAuth);
      const testDoc = db
        .collection(`conferences/${conferenceName}/sessions`)
        .doc(sessionId);
      await firebase.assertFails(testDoc.update({ content: "after" }));
    });
  });
  describe("Hands", () => {
    const sessionId = "session123";
    it("Anonymous user cannot raise hand", async () => {
      await createSession(sessionId, myId);

      const db = getFirestore(null);
      const testDoc = db
        .collection(`conferences/${conferenceName}/sessions/${sessionId}/hands`)
        .doc(myId);
      await firebase.assertFails(testDoc.set({ id: myId }));
    });

    it("Registered user can raise hand in a Session", async () => {
      await createSession(sessionId, myId);

      const db = getFirestore(myAuth);
      const testDoc = db
        .collection(`conferences/${conferenceName}/sessions/${sessionId}/hands`)
        .doc(myId);
      await firebase.assertSucceeds(testDoc.set({ id: myId }));
    });

    it("Registered user can update own raised hand", async () => {
      await createSession(sessionId, myId);
      await createRaisedHand(sessionId, myId);

      const db = getFirestore(myAuth);
      const testDoc = db
        .collection(`conferences/${conferenceName}/sessions/${sessionId}/hands`)
        .doc(myId);
      await firebase.assertSucceeds(testDoc.update({ content: "after" }));
    });

    it("Registered user cannot update non-owned raised hand", async () => {
      await createSession(sessionId, myId);
      await createRaisedHand(sessionId, myId);

      const db = getFirestore(theirAuth);
      const testDoc = db
        .collection(`conferences/${conferenceName}/sessions/${sessionId}/hands`)
        .doc(myId);
      await firebase.assertFails(testDoc.update({ content: "after" }));
    });

    it("Session owner can update raised hands of own session", async () => {
      firebase.assertFails();
    });

    it("Session owner can update raised hands of own session", async () => {
      firebase.assertFails();
    });
  });

  describe("Questions", () => {
    const sessionId = "session123";
    it("Anonymous user cannot ask questions", async () => {
      await createSession(sessionId, myId);

      const db = getFirestore(null);
      const testDoc = db
        .collection(
          `conferences/${conferenceName}/sessions/${sessionId}/questions`
        )
        .doc(myId);
      await firebase.assertFails(testDoc.set({ id: myId }));
    });

    it("Registered user can ask a question in a Session", async () => {
      await createSession(sessionId, myId);

      const db = getFirestore(myAuth);
      const testDoc = db
        .collection(
          `conferences/${conferenceName}/sessions/${sessionId}/questions`
        )
        .doc(myId);
      await firebase.assertSucceeds(testDoc.set({ id: myId }));
    });

    it("Registered user cannot update non-owned question", async () => {
      await createSession(sessionId, myId);
      await createRaisedHand(sessionId, myId);

      const db = getFirestore(theirAuth);
      const testDoc = db
        .collection(
          `conferences/${conferenceName}/sessions/${sessionId}/questions`
        )
        .doc(myId);
      await firebase.assertFails(testDoc.update({ content: "after" }));
    });

    it("Session owner can update raised hands of own session", async () => {
      firebase.assertFails();
    });

    it("Session owner can update raised hands of own session", async () => {
      firebase.assertFails();
    });
  });
});

describe("Users", () => {
  it("Can write to a user document with the same ID as our user", async () => {
    const db = getFirestore(myAuth);

    const testDoc = db.collection("users").doc(myId);
    await firebase.assertSucceeds(testDoc.set({ foo: "bar" }));
  });

  it("Cannot write to a user document with a different ID as our user", async () => {
    const db = getFirestore(myAuth);

    const testDoc = db.collection("users").doc(theirId);
    await firebase.assertFails(testDoc.set({ foo: "bar" }));
  });
});

after(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
