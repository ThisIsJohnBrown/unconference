/// <reference types="Cypress" />

const conferenceName = "local";

describe("Sessions Page", () => {
  before(() => {
    cy.createConference(conferenceName);
    cy.visit("/");
    cy.logoutUser();
  });
  it.only("Sessions exist", () => {
    cy.visit("/sessions");
    cy.getState()
      .its("sessions.sessions")
      .should("have.lengthOf.greaterThan", 0);
  });
  it("No sessions should be current or future before the start of the conference", () => {
    cy.visit("/");
    cy.getState()
      .its("conferences.conference.startTime.seconds")
      .then(startTime => {
        cy.clock(startTime * 1000 - 1000 * 60);
      });
    cy.get("[data-cy=navbar-sessions-button]").click();
    cy.get("[data-cy=navbar-home-button]").click();
    cy.tick(2000);
    cy.wait(2000);
    cy.get("[data-cy=navbar-sessions-button]").click();
  });
});
