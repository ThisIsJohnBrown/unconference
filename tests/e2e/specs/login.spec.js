/// <reference types="Cypress" />

const conference = "local";
const creds = {
  email: "jeremie@goodplace.com",
  password: "asdfasdf"
};

describe("Login Features", () => {
  beforeEach(() => {
    cy.createConference(conference, "vuejs-online");
    cy.visit("/");
    cy.logoutUser();
  });
  it("Log in a user", () => {
    cy.get("[data-cy=navbar-profile-button]").should("not.exist");
    cy.get("[data-cy=navbar-login-button]")
      .should("exist")
      .click();
    cy.get("[data-cy=form-login-email]").type(creds.email);
    cy.get("[data-cy=form-login-password]").type(creds.password);
    cy.get("[data-cy=form-login-submit]").click();
    cy.get("[data-cy=navbar-profile-button]").should("exist");
  });

  it("Clear login data when clear button is pressed", () => {
    cy.visit("/login");

    cy.get("[data-cy=form-login-email]").type("asdf@asdf.com");
    cy.get("[data-cy=form-login-password]").type("asdfasdf1123");
    cy.get("[data-cy=form-login-clear]").click();
    cy.get("[data-cy=form-login-email]").should("have.value", "");
    cy.get("[data-cy=form-login-password]").should("have.value", "");
  });

  it("Show an error when bad username/password are entered", () => {
    cy.visit("/login");

    cy.get("[data-cy=form-login-email]").type("asdf@asdf.com");
    cy.get("[data-cy=form-login-password]").type("asdfasdf1123");
    cy.get("[data-cy=form-login-submit]").click();
    cy.get("[data-cy=form-login-error]").should("be.visible");
  });
});
