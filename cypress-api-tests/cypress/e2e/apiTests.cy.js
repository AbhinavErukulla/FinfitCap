/// <reference types="cypress" />

function schemaUser(body) {
  expect(body).to.have.property('success');
  expect(body.data).to.have.property('user');
  expect(body.data.user).to.include.keys('email', 'id');
}

describe('FindIt API contract & security', () => {
  const emailNew = () => `cy_${Date.now()}@findit.test`;

  it('API-01 health 200', () => {
    cy.request('/health').its('status').should('eq', 200);
  });


  it('API-02 register invalid email 422', () => {
    cy.request({
      method: 'POST',
      url: '/register',
      failOnStatusCode: false,
      body: {
        firstName: 'A',
        lastName: 'B',
        email: 'nope',
        password: 'TestPass123!',
        confirmPassword: 'TestPass123!',
      },
    }).its('status').should('eq', 422);
  });


  it('API-03 item detail bad type 400', () => {
    cy.request({
      url: '/item/1?type=bad',
      failOnStatusCode: false,
    }).its('status').should('eq', 400);
  });

  it('API-04 my items unauthorized 401', () => {
    cy.request({ url: '/user/my-items', failOnStatusCode: false }).its('status').should('eq', 401);
  });

  it('API-05 lost report unauthorized 401', () => {
    cy.request({
      method: 'POST',
      url: '/lost/report',
      failOnStatusCode: false,
      body: {
        title: 'x',
        description: 'not long enough',
        location: 'y',
      },
    }).its('status').should('eq', 401);
  });

  
  it('API-06 update item unauthorized 401', () => {
    cy.request({
      method: 'PUT',
      url: '/item/1/update?type=lost',
      failOnStatusCode: false,
      body: { title: 'Should fail no auth here length ok' },
    }).its('status').should('eq', 401);
  });

  it('API-07 contact owner unauthorized 401', () => {
    cy.request({
      method: 'POST',
      url: '/item/contact-owner',
      failOnStatusCode: false,
      body: {
        itemType: 'lost',
        itemId: 1,
        message: 'Hello world message with length.',
        contactEmail: 'x@y.z',
      },
    }).its('status').should('eq', 401);
  });

  
  it('API-08 delete requires auth', () => {
    cy.request({
      method: 'DELETE',
      url: '/item/1/delete?type=lost',
      failOnStatusCode: false,
    }).its('status').should('eq', 401);
  });

  it('API-09 error json has success false', () => {
    cy.request({
      method: 'POST',
      url: '/login',
      failOnStatusCode: false,
      body: { email: 'no@where.com', password: 'x' },
    }).then((res) => {
      expect(res.body.success).to.be.false;
      expect(res.body).to.have.property('code');
    });
  });

 

  it('API-10 register password mismatch 422', () => {
    cy.request({
      method: 'POST',
      url: '/register',
      failOnStatusCode: false,
      body: {
        firstName: 'A',
        lastName: 'B',
        email: emailNew(),
        password: 'TestPass123!',
        confirmPassword: 'TestPass124!',
      },
    }).its('status').should('eq', 422);
  });

});
