describe('frontend spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('should render the page properly', () => {
    cy.get('.RoomSelector')
      .should()
  })
})