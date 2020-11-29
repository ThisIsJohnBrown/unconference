/// <reference types="Cypress" />

const conference = "local";
const sessions = [
  "3-tips-about-bandwidth-you-cant-afford-to-miss",
  "5-secrets-how-to-use-transmitter-to-create-a-successful-businessproduct",
  "is-program-worth-to-you",
  "need-more-time-read-these-tips-to-eliminate-transmitter",
  "old-school-transmitter",
  "quick-and-easy-fix-for-your-matrix",
  "the-lazy-mans-guide-to-protocol"
];
const users = [
  "Alessandra.Welch",
  "Jeromy0",
  "Kyler98",
  "Laurianne_Block",
  "Shanelle.Wiza"
];
const creds = {
  email: "jeremie@goodplace.com",
  password: "asdfasdf"
};

describe("Session Interactions", () => {
  before(() => {
    cy.createConference(conference, "local");
    cy.createUsers(users);
    cy.createSessions(conference, sessions);
    cy.visit("/");
    cy.logoutUser();
  });
  it("Logged out user should not be able to join", () => {
    cy.visit(`/session/3-tips-about-bandwidth-you-cant-afford-to-miss`);
    cy.get("[data-cy=session-register-panel]").should("exist");
  });
  it("Logged in user should be able to join", () => {
    // cy.createUser(JEREMIE_UID, "jeremie-bearimy");
    cy.visit("/");
    cy.loginUser(creds.email, creds.password);
    cy.visit(`/session/${sessions[0]}`);
    cy.get("[data-cy=session-register-panel]").should("not.exist");
    // cy.callFirestore("update", `conferences/${conference}/sessions/$`)
  });
});
