/// <reference types="Cypress" />

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

Cypress.Commands.add("createUsers", (id, fixtures) => {
  fixtures.forEach(fix => {
    cy.fixture(`conferences/${id}/users/${fix}`).then(data => {
      cy.callFirestore("set", `users/${data.id}`, data);
    });
  });
});

Cypress.Commands.add("createSessions", (id, fixtures) => {
  fixtures.forEach(fix => {
    cy.fixture(`conferences/${id}/sessions/${fix}`).then(async data => {
      data.startTime = firebase.firestore.Timestamp.fromMillis(
        data.startTimeMillis
      );
      data.endTime = firebase.firestore.Timestamp.fromMillis(
        data.endTimeMillis
      );
      cy.callFirestore("set", `conferences/${id}/sessions/${data.id}`, data);
    });
  });
});

Cypress.Commands.add("createConference", conferenceName => {
  cy.callFirestore("delete", `conferences/${conferenceName}/sessions`, {
    recursive: true
  });
  cy.callFirestore("delete", `conferences`, { recursive: true });
  cy.callFirestore("delete", `users`, { recursive: true });
  cy.fixture(`conferences/${conferenceName}/conference.json`).then(data => {
    data.startTime = firebase.firestore.Timestamp.fromMillis(
      data.startTimeMillis
    );
    data.endTime = firebase.firestore.Timestamp.fromMillis(data.endTimeMillis);
    cy.callFirestore("set", `conferences/${conferenceName}`, data);
    cy.task(
      "readDirectoryOfFixtures",
      `fixtures/conferences/${conferenceName}/users`,
      { log: false }
    ).then(users => {
      cy.createUsers(conferenceName, users);
    });
    cy.task(
      "readDirectoryOfFixtures",
      `fixtures/conferences/${conferenceName}/sessions`,
      { log: false }
    ).then(sessions => {
      cy.createSessions(conferenceName, sessions);
    });
  });
});

attachCustomCommands({ Cypress, cy, firebase });
