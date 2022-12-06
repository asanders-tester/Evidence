/**
 * This is a test for the administrator dashboard portion of the Avalon Bay project. It is testing the screening
 * table results, which shows the screening outcome for the applicant based on a credit check and background check.
 * This is testing that the correct results are being displayed and that all functionality is working properly.
 * 
 * Each it block is a separate test case and titles give a brief description of the purpose of the test.
 */


/// <reference types="cypress" />

describe('Screening Block', function () {
    let data;
    // Login into app before each test
    before(function () {
        sessionStorage.clear();
        cy.fixture("adminDash").then(function (testData) {
            data = testData;
        });
        cy.visit(Cypress.env("cloudFrontUrl"));
        cy.login();
        cy.authenticateAPI();
    });

    after(function () {
        cy.get('.ant-dropdown-trigger.ant-dropdown-link.cstm-signout-link').click();
        cy.get('.ant-dropdown-menu-title-content > a').click();
        cy.url().should('not.include', '/dashboard');
    });

    it('Info matches between applicant information table and screening outcomes table', () => {
        let appName = [];
        let screenName = [];
        let searchKey = `${data.primaryNameFilter}`;

        cy.get('#avb-filters-unit-application-name input').type(searchKey);
        cy.get('.ant-table-tbody').first().find('a').invoke('removeAttr', 'target').click();
        cy.location('pathname', { timeout: 60000 }).should('include', '/application-details');

        // Get names from applicant information table
        cy.get('#avb-applicants tbody tr > :nth-child(1)').each((txt) => {
            let nameText = txt.text().toString().toLowerCase();
            appName.push(nameText);
        });

        // Get names from screening table
        cy.get('#avb-screening tbody tr > :nth-child(1)').each((txt) => {
            let nameText = txt.text().toString().toLowerCase();
            screenName.push(nameText);
        }).should(() => {
            expect(appName).to.include.members(screenName);
        });
    });

    it('Applicant Information and Screening & ID sections can be collapsed and expanded', () => {
        // Applicant Information section
        cy.get('#avb-applicants .ant-collapse-content')
            .should('have.class', 'ant-collapse-content-active');
        cy.get('#avb-applicants .ant-collapse-header').click();
        cy.get('#avb-applicants .ant-collapse-content')
            .should('have.class', 'ant-collapse-content-inactive');
        cy.get('#avb-applicants .ant-collapse-header').click();
        cy.get('#avb-applicants .ant-collapse-content')
            .should('have.class', 'ant-collapse-content-active');

        // Screening & ID section
        cy.get('#avb-screening .ant-collapse-content')
            .should('have.class', 'ant-collapse-content-active');
        cy.get('#avb-screening .ant-collapse-header').click();
        cy.get('#avb-screening .ant-collapse-content')
            .should('have.class', 'ant-collapse-content-inactive');
        cy.get('#avb-screening .ant-collapse-header').click();
        cy.get('#avb-screening .ant-collapse-content')
            .should('have.class', 'ant-collapse-content-active');
    });

    it('Action and status reflects values returned from API', () => {
        let action = [];
        let status = [];

        // Get action values and compare to API
        cy.get('#avb-screening tbody tr > :nth-child(2)').each((txt) => {
            let actionText = txt.text();
            action.push(actionText);
        }).then(() => {
            let apiKey = Cypress.env("xApiKey");
            let apiUrl = Cypress.env("apiURL");
            let token = Cypress.env("token");

            cy.request({
                method: 'GET',
                url: `${apiUrl}/applications`,
                json: true,
                headers: { 
                    'x-api-key': apiKey, 
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                const statusMap = {
                    1: "Approved",
                    2: "Approved with conditions",
                    3: "Declined",
                    4: "Further review",
                    5: "Pending",
                    6: "Guarantor required",
                    7: "Document submission completed",
                    8: "Retry allowed",
                    9: "Problem resolution",
                    10: "Approved with conditions (conditions met)"
                };

                let body = response.body
                let application = body.applications.filter(app => app.applicationId === data.screeningApplicationId);
                console.log(application);
                let applicants = application[0]['applicants'];
                console.log(applicants);

                let screenings = applicants.reduce((cum, applicant) => {
                    const onfido = applicant.applicantScreening.find(as => as.screeningVendorId === 1);
                    console.log(onfido)
                    const onfidoResult = onfido ? onfido.screeningStatusId : null;
                    console.log(onfidoResult)
                    const fadv = applicant.applicantScreening.find(as => as.screeningVendorId === 2);
                    console.log(fadv)
                    const fadvResult = fadv ? fadv.screeningStatusId : null;
                    console.log(fadvResult)
                    cum.push({
                        applicantId: applicant.id,
                        onfido: statusMap[onfidoResult] || null,
                        fadv: statusMap[fadvResult] || null
                    });
                    return cum;
                }, []);
                console.log(screenings);

                Object.keys(screenings['fadv']).map(function (key) {
                    if (screenings[key] === null || screenings[key] === undefined) {
                        screenings[key] = "";
                    }
                });
                console.log(action)
                expect(action).to.include.members(screenings);

                // Get status values and compare to API
                cy.get('#avb-screening tbody tr > :nth-child(3)').each((txt) => {
                    let statusText = txt.text();
                    status.push(statusText);
                });

                 Object.keys(screenings['onfido']).map(function (key) {
                    if (screenings[key] === null) {
                        screenings[key] = "";
                    }
                });
                console.log(status);
                expect(status).to.include.members(screenings);
            });
        });
    });
});
