/**
 * This is a test for the administrator dashboard API portion of the Avalon Bay project. It is testing a help request,
 * which is a request that can be sent by an applicant for help with the application process.
 * This is testing that the response of the GET request for the help request is returning the correct info.
 * 
 * Each it block is a separate test case and titles give a brief description of the purpose of the test.
 */


//This includes tests for admin dashboard apis
describe("Admin dashboard GET help requests by application Id", function () {

    beforeEach(() => {
        cy.authenticateHelpRequestApi();
        cy.fixture('adminDash').then(function (data) {
            this.data = data;
        });
    });

    it('Verify 200 status code', function () {
        let url = Cypress.env("helpRequestUrl");
        let apiKey = Cypress.env("helpRequestXApiKey");
        let token = Cypress.env("token");

        cy.request({
            method: 'GET',
            url: `${url}/applications/${this.data.helpRequestApplicationId}/help-requests`,
            headers: { 'x-api-key': apiKey, 'Authorization': `Bearer ${token}` },
        }).should((response) => {
            expect(response.status).to.equal(200);
        });
    });

    it('Verify help request response format', function () {
        let url = Cypress.env("helpRequestUrl");
        let apiKey = Cypress.env("helpRequestXApiKey");
        let token = Cypress.env("token");

        cy.request({
            method: 'GET',
            url: `${url}/applications/${this.data.helpRequestApplicationId}/help-requests`,
            headers: { 'x-api-key': apiKey, 'Authorization': `Bearer ${token}` },
        }).should((response) => {
            //Verify response format
            let body = response.body;
            console.log(JSON.stringify(body));
            let helpRequests = body['helpRequests'][0];
            expect(helpRequests).to.have.own.property("id");
            expect(helpRequests).to.have.own.property("helpRequestTopicId");
            expect(helpRequests).to.have.own.property("helpStatus");
            expect(helpRequests).to.have.own.property("additionalComments");
            expect(helpRequests).to.have.own.property("createdBy");
            expect(helpRequests).to.have.own.property("createdDate");
            expect(helpRequests).to.have.own.property("modifiedBy");
            expect(helpRequests).to.have.own.property("modifiedDate");
            expect(helpRequests).to.have.own.property("applicantId");
            expect(helpRequests).to.have.own.property("applicationId");
            expect(helpRequests).to.have.own.property("helpRequestTopic");
        });
    });
});
