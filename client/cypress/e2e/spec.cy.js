describe('frontend spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })


  it('should add a room correctly', () => {
    cy.get('.SelectorInput')
      .type('Test Room')

    cy.get('.JoinButton')
      .click()

    cy.get('.Room')
      .contains('Test Room')

    cy.get('.Message.me')

    cy.get('.RoomButton')
      .contains('Test Room')

  })

  it('room should be removed if closed with no-one else in the chat', () => {
    cy.get('.SelectorInput')
      .type('Test Room')

    cy.get('.JoinButton')
      .click()

    cy.get('.Room')
      .contains('Test Room')

    cy.get('.Message.me')

    cy.get('.RoomButton')
      .contains('Test Room')

    cy.get('.LeaveButton')
      .click()

    cy.get('.Room')
      .should('not.exist')

    cy.get('.RoomButton')
      .should('not.exist')

  })
})