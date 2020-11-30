/* eslint-disable arrow-body-style */

const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const cypressFirebasePlugin = require("cypress-firebase").plugin;

module.exports = (on, config) => {
  on(
    "task",
    {
      readDirectoryOfFixtures(dir) {
        return fs.readdirSync(dir).filter(function(file) {
          return path.extname(file).toLowerCase() === ".json";
        });
      }
    },
    { log: false }
  );

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
