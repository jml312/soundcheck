describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})


describe("Home Page", () => {
  it("should display the home page", () => {
    cy.visit("http://localhost:3000");
    cy.get("button").should("contain", "Continue with Spotify");
  });
});
