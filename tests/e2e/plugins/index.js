/* eslint-disable arrow-body-style */

const admin = require("firebase-admin");
const cypressFirebasePlugin = require("cypress-firebase").plugin;

module.exports = (on, config) => {
  const serviceAccount = require(config.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.env.FIRESTORE_DATABASEURL
  });

  const firestoreEmulatorHost = config.env.FIRESTORE_EMULATOR_HOST;
  if (firestoreEmulatorHost) {
    admin.firestore().settings({
      host: firestoreEmulatorHost,
      ssl: false,
      experimentalForceLongPolling: true
    });
  }

  const authEmulatorHost = config.env.FIREBASE_AUTH_EMULATOR_HOST;
  if (authEmulatorHost) {
    admin.auth.useEmulator(authEmulatorHost);
  }

  return cypressFirebasePlugin(on, config, admin);
};
