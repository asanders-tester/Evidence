/**
 * This is one of the page object models for the Avalon Bay applease website (where a user applies for a unit). 
 * This particular page is for creating a new user, adding adult occupants, guarantors, and dependents to the 
 * application for a specific property and unit.
 */


/// <reference types="Cypress" />

class OccupantsAndGuarantors {
    /**
     * Update the applicant's information
     * @param {int} applicantNum 
     */
    editInfo(applicantNum) {
        cy.contains('button', 'Edit').each(($el, index) => {
            if (index === applicantNum) {
                cy.wrap($el).click();
            }
        });
    }

    /**
     * Sets the new user's email address
     * @returns {array[string, string]} [email, defaultTag]
     */
     setEmailAddress() {
        // Create a new email address
        let defaultTag = 'avbAdditionalAutomatedUser';
        let randVal = Math.random().toString(36).replace(/[^a-zA-Z0-9]/g, '').substring(0, 5);
        defaultTag = defaultTag + randVal;

        const email = `applease.${defaultTag}@inbox.testmail.app`;
        return [email, defaultTag];
    }

    /**
     * Gets the user's email address
     * @returns {string} email
     */
    getEmailAddress() {
        let email = this.setEmailAddress();
        return email;
    }
    
    /**
     * Create a new user and verify the account
     * cy.createNewUser() can be found in commands.js
     * returns the user's email address
     */
    createUser() {
        let email = this.getEmailAddress();
        cy.clearLocalStorage();
        cy.reload();
        cy.createNewUser(email);
    }

    /**
     * Send an invite to an adult occupant
     * The appType is the nested object within the env object for each type of applicant in cypress.config.js
     * Options for appType are: approved, declined, approvedWithConditions, additionalApproved, additionalDeclined
     *                          and additionalAWC
     * Set addPersonalInfo to true if the application info will be added. The default is false.
     * @param {string} appType 
     * @param {boolean} addPersonalInfo 
     */
    addAdult(appType, addPersonalInfo) {
        let email = this.getEmailAddress();
        cy.get('div[data-tc="adult-cards-list"] > div:last-child').then($el => {
            $el.trigger('mouseover');
            cy.wait(2000); // Small wait for the button to become active
            cy.wrap($el).click();
        });
        
        cy.wait(30000); // Explicit wait for the mriNameId to get generated. There may be an implicit way to do this.
        cy.get('input#recipientFirstName').type(Cypress.env(`${appType}Applicant`).firstName);
        cy.get('input#recipientLastName').type(Cypress.env(`${appType}Applicant`).lastName);
        cy.get('input#email').type(email[0]);

        if (addPersonalInfo) {
            cy.get('input#authorization-check-box').check();
            cy.addApplicantInfo(appType);
        }

        cy.contains('button', 'Send Email').click();
        cy.wait(1000); // Wait for the email to get sent
        cy.get('button#occupantSave').click();
    }

    /**
     * Send an invite to a guarantor
     * The appType is the nested object within the env object for each type of applicant in cypress.config.js
     * Options for appType are: approved, declined, additionalApproved, additionalDeclined
     * Set addPersonalInfo to true if the application info will be added. The default is false.
     * @param {string} appType 
     * @param {boolean} addPersonalInfo 
     */
    addGuarantor(appType, addPersonalInfo) {
        let email = this.getEmailAddress();
        cy.contains('div', 'Add Guarantor', { timeout: 1000 }).click();
        cy.get('input#recipientFirstName').type(Cypress.env(`${appType}Applicant`).firstName);
        cy.get('input#recipientLastName').type(Cypress.env(`${appType}Applicant`).lastName);
        cy.get('input#email').type(email);

        if (addPersonalInfo) {
            cy.get('input#authorization-check-box').check();
            cy.addApplicantInfo(appType);
        }

        cy.contains('button', 'Send Email').click();
        cy.wait(1000); // Wait for the email to get sent
        cy.get('button#occupantSave').click();
    }

    /**
     * Add a dependent to the application
     * The appType is the nested object within the env object for each type of applicant in cypress.config.js
     * Options for appType are: dependent and additionalDependent
     * @param {string} appType 
     */
    addDependent(appType) {
        cy.contains('div', 'Add Additional Dependent', { timeout: 1000 }).click();
        cy.get('input#firstName').type(Cypress.env(`${appType}Applicant`).firstName);
        cy.get('input#lastName').type(Cypress.env(`${appType}Applicant`).lastName);
        cy.get('input#month').type(Cypress.env(`${appType}Applicant`).birthMonth);
        cy.get('input#day').type(Cypress.env(`${appType}Applicant`).birthDay);
        cy.get('input#year').type(Cypress.env(`${appType}Applicant`).birthYear);
        cy.get('button#dependentSave').click();
    }

    /**
     * Click the Next button to continue to the next page
     */
     clickNext() {
        cy.goToNextPage();
    }
}

export default OccupantsAndGuarantors;