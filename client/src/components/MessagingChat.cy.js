import React from 'react'
import Chat from './Messaging'

describe('<Chat />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Chat />)
  })
})