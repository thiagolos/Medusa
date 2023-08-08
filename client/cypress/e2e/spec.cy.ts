describe('frontend spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173')
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

  it('should add a second room correctly', () => {
    cy.get('.SelectorInput')
      .type('Test Room')

    cy.get('.JoinButton')
      .click()

    cy.get('.Room')
      .contains('Test Room')

    cy.get('.Message.me')

    cy.get('.RoomButton')
      .contains('Test Room')

    cy.get('.PlusButton button')
      .click()

    cy.get('.SelectorInput')
      .type('Test Room 2')

    cy.get('.JoinButton')
      .click()

    cy.get('.Room')
      .contains('Test Room 2')

    cy.get('.Message.me')

    cy.get('.RoomButton')
      .contains('Test Room 2')
  })
})

export {}