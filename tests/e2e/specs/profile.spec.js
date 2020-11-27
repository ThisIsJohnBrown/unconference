/// <reference types="Cypress" />

const JEREMIE_UID = "9VDNCG2ysfpUYvc3L7xw8sOB0kuE";
const conference = "local";

beforeEach(() => {
  cy.createConference(conference);
  cy.createUser(JEREMIE_UID);
  cy.visit("/");
  cy.logoutUser();
  cy.loginUser("jeremie@goodplace.com", "asdfasdf");
  cy.visit("/me");
});

describe("Log in User", () => {
  beforeEach(() => {
    // cy.logoutUser();
  });
  it("Change display name for user", () => {
    const newDisplayName = "Zak";

    cy.get("[data-cy=display-name-input").should(
      "have.value",
      "Jeremie Bearimy"
    );
    cy.get("[data-cy=edit-cancel-button]").click();
    cy.get("[data-cy=display-name-input]")
      .clear()
      .type("Zak");
    cy.get("[data-cy=save-button").click();
    cy.get("[data-cy=display-name-input").should("have.value", newDisplayName);
    cy.get("[data-cy=navbar-home-button").click();
    cy.url().should("equal", Cypress.config().baseUrl + "/");
    cy.get("[data-cy=navbar-profile-button").click();
    cy.get("[data-cy=display-name-input").should("have.value", newDisplayName);
  });

  // it("Social links should work for profile", () => {});
});
