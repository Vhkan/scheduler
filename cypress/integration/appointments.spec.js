describe("should book an interview", () => {

 // Reset DB state before each test
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/"); 
    cy.contains('[data-testid="day"]', "Monday");
  });

  it("should visit the root", () => {
    // cy.contains("Monday");
    cy.get('[alt=Add]').first().click();
    //.type("Lydia Miller-Jones")
    //cy.get('input').type("Lydia Miller-Jones");
    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");
    cy.get('.interviewers__item').first().click();
    cy.contains("Save").click();
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  // it("should edit an interview", () => {
  // cy.contains(".appointment__card--show", "Archie Cohen")
  // .parent().find("[alt=Edit]").click('bottomRight', { force: true });
  // cy.get("[data-testid=student-name-input]").clear().type("Myroslav Johnovych Kuvaldin");
  // cy.get('.interviewers__item').eq(1).click();
  // cy.contains("Save").click();
  //cy.contains(".appointment__card--show","Myroslav Johnovych Kuvaldin");
  // });


  it("should edit an interview", () => {
    cy.get("[alt=Edit]")
      .first()
      .click({ force: true });
  
    cy.get("[data-testid=student-name-input]").clear().type("Lydia Miller-Jones");
    cy.get("[alt='Tori Malcolm']").click();
  
    cy.contains("Save").click();
  
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });

  it("should cancel an interview", () => {
    cy.get("[alt=Delete]").click({ force: true });
    cy.contains(".button--danger", "Confirm").click();
    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");
    cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");
  });
});