/* eslint-disable no-undef */
const firebase = require("@firebase/testing");
// var debug = require("debug");

const MY_PROJECT_ID = "vue-auth-test-d1926";
const conferenceName = "local";
const myId = "user_me";
const theirId = "user_them";
const myAuth = { uid: myId, email: "me@gmail.com" };
const theirAuth = { uid: theirId, email: "them@gmail.com" };

let app;
let db;
let adminApp;
let admin;

async function getFirestore(auth) {
  if (app) app.delete();
  app = await firebase.initializeTestApp({
    projectId: MY_PROJECT_ID,
    auth: auth
  });
  db = app.firestore();
}

function getAdminFirestore() {
  if (adminApp) adminApp.delete();
  adminApp = firebase.initializeAdminApp({ projectId: MY_PROJECT_ID });
  admin = adminApp.firestore();
}

beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
  if (app) app.delete();
  if (adminApp) adminApp.delete();
});

async function createSession(sessionId, id) {
  await getAdminFirestore();
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
  await getAdminFirestore();
  await admin
    .collection(`conferences/${conferenceName}/sessions/${sessionId}/hands`)
    .doc(id)
    .set({
      content: "before"
    });
}

async function createAskedQuestion(sessionId, id) {
  await getAdminFirestore();
  await admin
    .collection(`conferences/${conferenceName}/sessions/${sessionId}/questions`)
    .doc(id)
    .set({
      content: "before"
    });
}

describe("User", () => {
  it("Anonymous user cannot create a User's data", async () => {
    await getFirestore(null);

    const testDoc = db.collection("users").doc("testDoc");
    await firebase.assertFails(testDoc.set({ foo: "bar" }));
  });

  it("Authorized user create their own User data", async () => {
    await getFirestore(myAuth);
    const testDoc = db.collection("users").doc(myId);
    await firebase.assertSucceeds(testDoc.set({ title: "test" }));
  });

  it("Authorized user cannot create User data not belonging to themselves", async () => {
    await getFirestore(theirAuth);
    const testDoc = db.collection("users").doc(myId);
    await firebase.assertFails(testDoc.set({ title: "test" }));
  });

  it("Authorized user can update User data belonging to themselves", async () => {
    await getFirestore(myAuth);
    await getAdminFirestore();
    await admin
      .collection("users")
      .doc(myId)
      .set({ content: "before" });

    const testDoc = db.collection("users").doc(myId);
    await firebase.assertSucceeds(testDoc.update({ content: "after" }));
  });

  it("Authorized user cannot update User data belonging another user", async () => {
    await getFirestore(theirAuth);
    await getAdminFirestore();
    await admin
      .collection("users")
      .doc(myId)
      .set({ content: "before" });

    const testDoc = db.collection("users").doc(myId);
    await firebase.assertFails(testDoc.update({ content: "after" }));
  });
});

describe("Conferences", () => {
  it("Anonymous user can read conference info", async () => {
    await getFirestore(null);

    const testDoc = db.collection("conferences").doc("testDoc");
    await firebase.assertSucceeds(testDoc.get());
  });

  it("Anonymous user cannot write to conferences", async () => {
    await getFirestore(null);

    const testDoc = db.collection("conferences").doc("testDoc");
    await firebase.assertFails(testDoc.set({ title: "test" }));
  });
});

describe("Sessions", () => {
  it("Anonymous user can read all sessions", async () => {
    await getFirestore(null);

    const testQuery = db.collection(`conferences/${conferenceName}/sessions`);
    await firebase.assertSucceeds(testQuery.get());
  });
  describe("Session CRUD", () => {
    it("Anonymous user cannot create a session", async () => {
      await getFirestore(null);

      const testDoc = db
        .collection(`conferences/${conferenceName}/sessions`)
        .doc("testSession");
      await firebase.assertFails(testDoc.set({ foo: "bar" }));
    });

    it("Registered user can create a session", async () => {
      await getFirestore(myAuth);
      await getAdminFirestore();
      const sessionId = "session123";

      await admin
        .collection("conferences")
        .doc(conferenceName)
        .set({});
      const testDoc = db
        .collection(`conferences/${conferenceName}/sessions`)
        .doc(sessionId);
      await firebase.assertSucceeds(testDoc.set({ created_by: { id: myId } }));
    });

    it("Registered user can update a session owned by them", async () => {
      const sessionId = "session123";
      await createSession(sessionId, myId);

      await getFirestore(myAuth);
      const testDoc = db
        .collection(`conferences/${conferenceName}/sessions`)
        .doc(sessionId);
      await firebase.assertSucceeds(testDoc.update({ content: "after" }));
    });

    it("Registered user cannot update a session owned by another user", async () => {
      const sessionId = "session123";
      await createSession(sessionId, myId);

      await getFirestore(theirAuth);
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

      await getFirestore(null);
      const testDoc = db
        .collection(`conferences/${conferenceName}/sessions/${sessionId}/hands`)
        .doc(myId);
      await firebase.assertFails(testDoc.set({ id: myId }));
    });

    it("Registered user can raise hand in a Session", async () => {
      await createSession(sessionId, myId);

      await getFirestore(myAuth);
      const testDoc = db
        .collection(`conferences/${conferenceName}/sessions/${sessionId}/hands`)
        .doc(myId);
      await firebase.assertSucceeds(testDoc.set({ id: myId }));
    });

    it("Registered user can update own raised hand", async () => {
      await createSession(sessionId, myId);
      await createRaisedHand(sessionId, theirId);

      await getFirestore(theirAuth);
      const testDoc = db
        .collection(`conferences/${conferenceName}/sessions/${sessionId}/hands`)
        .doc(theirId);
      await firebase.assertSucceeds(testDoc.update({ content: "after" }));
    });

    it("Registered user cannot update non-owned raised hand", async () => {
      await createSession(sessionId, myId);
      await createRaisedHand(sessionId, myId);

      await getFirestore(theirAuth);
      const testDoc = db
        .collection(`conferences/${conferenceName}/sessions/${sessionId}/hands`)
        .doc(myId);
      await firebase.assertFails(testDoc.update({ content: "after" }));
    });

    it("Session owner can update raised hands of owned session", async () => {
      await createSession(sessionId, myId);
      await createRaisedHand(sessionId, theirId);

      await getFirestore(myAuth);
      const testDoc = db
        .collection(`conferences/${conferenceName}/sessions/${sessionId}/hands`)
        .doc(theirId);
      await firebase.assertSucceeds(testDoc.update({ content: "after" }));
    });
  });

  describe("Questions", () => {
    const sessionId = "session123";
    it("Anonymous user cannot ask question", async () => {
      await createSession(sessionId, myId);

      await getFirestore(null);
      const testDoc = db
        .collection(
          `conferences/${conferenceName}/sessions/${sessionId}/questions`
        )
        .doc(myId);
      await firebase.assertFails(testDoc.set({ id: myId }));
    });

    it("Registered user can ask question in a Session", async () => {
      await createSession(sessionId, myId);

      await getFirestore(myAuth);
      const testDoc = db
        .collection(
          `conferences/${conferenceName}/sessions/${sessionId}/questions`
        )
        .doc(myId);
      await firebase.assertSucceeds(testDoc.set({ id: myId }));
    });

    it("Registered user can update own asked questions", async () => {
      await createSession(sessionId, myId);
      await createAskedQuestion(sessionId, theirId);

      await getFirestore(theirAuth);
      const testDoc = db
        .collection(
          `conferences/${conferenceName}/sessions/${sessionId}/questions`
        )
        .doc(theirId);
      await firebase.assertSucceeds(testDoc.update({ content: "after" }));
    });

    it("Registered user cannot update non-owned asked questions", async () => {
      await createSession(sessionId, myId);
      await createAskedQuestion(sessionId, myId);

      await getFirestore(theirAuth);
      const testDoc = db
        .collection(
          `conferences/${conferenceName}/sessions/${sessionId}/questions`
        )
        .doc(myId);
      await firebase.assertFails(testDoc.update({ content: "after" }));
    });

    it("Session owner can update asked questions of owned session", async () => {
      await createSession(sessionId, myId);
      await createAskedQuestion(sessionId, theirId);

      await getFirestore(myAuth);
      const testDoc = db
        .collection(
          `conferences/${conferenceName}/sessions/${sessionId}/questions`
        )
        .doc(theirId);
      await firebase.assertSucceeds(testDoc.update({ content: "after" }));
    });
  });
});

describe("Users", () => {
  it("Can write to a user document with the same ID as our user", async () => {
    await getFirestore(myAuth);

    const testDoc = db.collection("users").doc(myId);
    await firebase.assertSucceeds(testDoc.set({ foo: "bar" }));
  });

  it("Cannot write to a user document with a different ID as our user", async () => {
    await getFirestore(myAuth);

    const testDoc = db.collection("users").doc(theirId);
    await firebase.assertFails(testDoc.set({ foo: "bar" }));
  });
});

after(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
  if (app) app.delete();
  if (adminApp) adminApp.delete();
});
