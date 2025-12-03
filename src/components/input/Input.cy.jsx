import React from 'react';
import Input from './Input';
import '../../index.css'; // Include global styles if needed

describe('<Input />', () => {
  it('renders with placeholder and correct type', () => {
    cy.mount(
      <Input
        type="text"
        name="testInput"
        placeholder="Enter your name"
        className="custom-class"
      />
    );
    cy.get('input')
      .should('have.attr', 'placeholder', 'Enter your name')
      .and('have.attr', 'type', 'text')
      .and('have.class', 'input-field')
      .and('have.class', 'custom-class');
  });

  it('accepts input and triggers onChange', () => {
    const handleChange = cy.stub().as('onChange');

    cy.mount(
      <Input
        type="text"
        name="testInput"
        placeholder="Enter text"
        onChange={handleChange}
      />
    );

    cy.get('input')
      .type('Hello')
      .should('have.value', 'Hello');

    cy.get('@onChange').should('have.been.called');
  });
});
