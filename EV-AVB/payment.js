/**
 * This is one of the page object models for the Avalon Bay applease website (where a user applies for a unit).
 * This particular page is for submitting a payment for the application fee through a third-party service called
 * Paymentus. The code was imbedded into the webpage as an iframe which means that portion of the UI was directly
 * linked to Paymentus and not written by Avalon Bay.
 */


/// <reference types="Cypress" />
/// <reference types="cypress-iframe" />

import 'cypress-iframe'

class PayAndSubmit {
    /**
     * Pay the full application fee for all current applicants
     */
    payFullAmount() {
        cy.contains('button', 'Proceed to Payment').click();
    }

    /**
     * Divide the application fee between all current applicants
     */
    splitAmount() {
        cy.contains('button', 'Split Amount').click();
        expect(cy.get('li:nth-child(1) span:nth-child(2)')).to.include('You');
        expect(cy.get('ul li:nth-child(1) input')).to.be.checked;
        cy.get('ul li:nth-child(n + 2) input').each(($el) => {
            cy.wrap($el).check();
        });
        cy.contains('button', 'Proceed to Payment').click();
    }

    /**
     * Complete the Paymentus form and submit the application
     * Information for the form can be found in the env object in cypress.config.js
     * @param {string} appType
     */
    makePayment(appType) {
        cy.frameLoaded('iframe[src=javascript:false]');
        cy.iframe().find('input#customer.dayPhone.formattedText').type(Cypress.env(`${appType}Applicant`).phoneNumber);
        cy.iframe().find('input#customer.address.line1').type(Cypress.env(`${appType}Applicant`).address1);
        cy.iframe().find('input#customer.address.city').type(Cypress.env(`${appType}Applicant`).city);

        cy.iframe().find('select#customer.address.state').click();
        // Match the 2 letter state acronym to the full state name
        const acronym = Cypress.env(`${appType}Applicant`).state.match(/\b(\w)/g).join('');
        cy.iframe().find('select#customer.address.state').type(acronym);
        cy.iframe().find('select#customer.address.state').each(($el) => {
            if ($el === state) {
                cy.wrap($el).click();
            }
        });

        cy.iframe().find('input#customer.address.zipCode').type(Cypress.env(`${appType}Applicant`).zip);
        cy.iframe().find('input#radio-pm-cc-1').click();
        cy.iframe().find('input#ccAccountNumber').type(Cypress.env('ccNumber'));
        cy.iframe().find('input#ccCvv').type(Cypress.env('cvv'));

        cy.iframe().find('select#ccExpiryDateMonth').click();
        const expMonth = Cypress.env('expMonth');
        cy.iframe().find('select#ccExpiryDateMonth').each(($el) => {
            if ($el === expMonth) {
                cy.wrap($el).click();
            }
        });

        const expYear = Cypress.env('expYear');
        cy.iframe().find('select#ccExpiryDateYear').click();
        cy.iframe().find('select#ccExpiryDateYear').each(($el) => {
            if ($el === expYear) {
                cy.wrap($el).click();
            }
        });

        const firstName = Cypress.env(`${appType}Applicant`).firstName;
        const lastName = Cypress.env(`${appType}Applicant`).lastName;
        cy.iframe().find('input#ccCardHolderName').type(`${firstName} ${lastName}`);
        cy.iframe().find('input[name=continueButton]').click();
        cy.iframe().find('input#acceptTermsAndConditions-1').click();
        cy.iframe().find('a#make-payment-btn', { timeout:10000 }).click();

        cy.contains('p', 'Your payment has been accepted').should('exist');
        cy.contains('button', 'Submit Application', { timeout: 20000 }).click();
    }
}

export default PayAndSubmit;