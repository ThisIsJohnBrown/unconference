/// <reference types="Cypress" />

import faker from "faker";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import { attachCustomCommands } from "cypress-firebase";
const serviceAccount = require("../../../firebase.config.js");

firebase.initializeApp(serviceAccount);

Cypress.Commands.add("app", () => cy.window().its("__app__"));
Cypress.Commands.add("getStore", () => cy.window().its("__app__.$store"));
Cypress.Commands.add("getState", () => cy.window().its("__app__.$store.state"));

Cypress.Commands.add("loginUser", (email, password) => {
  cy.logoutUser();
  cy.getStore().then(store => {
    store.dispatch("user/emailPasswordLogin", {
      email,
      password
    });
  });
  cy.get("[data-cy=navbar-profile-button").should("exist");
});

Cypress.Commands.add("logoutUser", () => {
  cy.getStore().then(store => {
    store.dispatch("user/logout");
  });
  cy.get("[data-cy=navbar-profile-button").should("not.exist");
});

Cypress.Commands.add("createUsers", fixtures => {
  fixtures.forEach(fix => {
    cy.fixture(`users/${fix}.json`).then(data => {
      cy.callFirestore("set", `users/${data.id}`, data);
    });
  });
});

Cypress.Commands.add("createSessions", (id, fixtures) => {
  console.log(id, fixtures);
  fixtures.forEach(fix => {
    cy.fixture(`sessions/${fix}.json`).then(data => {
      data.startTime = firebase.firestore.Timestamp.fromMillis(
        data.startTimeMillis
      );
      data.endTime = firebase.firestore.Timestamp.fromMillis(
        data.endTimeMillis
      );
      console.log(data);
      cy.callFirestore("set", `conferences/${id}/sessions/${data.id}`, data);
    });
  });
});

Cypress.Commands.add("createConference", (conference, fix) => {
  cy.fixture(`conferences/${fix}.json`).then(data => {
    data.startTime = firebase.firestore.Timestamp.fromMillis(
      data.startTimeMillis
    );
    data.endTime = firebase.firestore.Timestamp.fromMillis(data.endTimeMillis);
    cy.callFirestore("set", `conferences/${conference}`, data);

    cy.callFirestore("get", `conferences/${conference}/sessions`).then(
      sessions => {
        if (sessions) {
          sessions.forEach(session => {
            cy.callFirestore(
              "delete",
              `conferences/${conference}/sessions/${session.id}`
            );
          });
        }
      }
    );
  });
});

attachCustomCommands({ Cypress, cy, firebase });
