//First test 
describe("Navigation", () => {
  it("should visit the root", () => {
    cy.visit('/');
  });

  it("should navigate to Tuesday", () => {
    cy.visit('/');
    //cy.get("li").contains("Tuesday").click();
    // cy.contains("li", "Tuesday");
    //cy.contains("li", "Tuesday").click().should("have.css", "background-color", "rgb(242, 242, 242)");
    //cy.get('[data-testid="day"]').contains("Tuesday").click();
    cy.contains('[data-testid="day"]', "Tuesday").click().should("have.class", "day-list__item--selected");
  });
});