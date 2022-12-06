/**
 * This is the end-to-end test for a happy-path user. It ends after adding all occupants to the application. This
 * is as far as I was able to get before leaving the project and handing it over to Avalon Bay's internal QA team.
 * Date of last modification shows as 8/26/2022.
 */


///<reference types="cypress"/>

import LandingPage from "../page-objects/landing-page";
import Apartments from "../page-objects/apartments";
import AvailableUnits from "../page-objects/units";
import ApplyNow from "../page-objects/apply";
import ConfigureLease from "../page-objects/configure-lease";
import LoginPage from "../page-objects/login-page";
import BeginApplication from "../page-objects/begin-application";
import FillApplicantInfo from "../page-objects/application";
import OccupantsAndGuarantors from "../page-objects/applicants";

const landing = new LandingPage();
const apartments = new Apartments();
const units = new AvailableUnits();
const apply = new ApplyNow();
const lease = new ConfigureLease();
const login = new LoginPage();
const begin = new BeginApplication();
const application = new FillApplicantInfo();
const applicant = new OccupantsAndGuarantors();

describe('Happy path end-to-end test', () => {
    it('Successfully completes an application', () => {
        cy.log('Navigate to website and select a community');

        landing.visit();
        landing.findApartment(Cypress.env('community'));

        cy.log('Select how many bedrooms applicant needs');

        apartments.selectBasedOnBedroomAmount(Cypress.env('bedrooms'));

        cy.log('Select an available unit');

        units.selectUnit();

        cy.log('Click the Apply Now button');

        apply.verifyUnit();
        apply.applyNow();

        cy.log('Select the term length, occupants/applicants, and pets');

        lease.unitError(); // This test will let you know if the unit is not actually available.
        lease.selectTerm(Cypress.env('term'));
        lease.selectNumOfOccupants(Cypress.env('adults'), Cypress.env('child(ren)'), Cypress.env('guarantors'));
        lease.selectNumOfPets(Cypress.env('cats'), Cypress.env('dogs'));
        lease.saveAndContinue();

        cy.log('Create a new user account');

        login.createUser();

        cy.log('Click Next to create the application');

        begin.clickNext();

        cy.log('Fill in the application');

        application.addPrimaryApplicant('approved');

        application.clickNext();

        cy.log('Add another occupant');

        applicant.addAdult('additionalApproved', false);

        applicant.clickNext();

        cy.log('Review the applicant\'s information');
    });
});