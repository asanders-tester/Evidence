/**
 * This is a test for the administrator dashboard API portion of the Avalon Bay project. It is testing a help request,
 * which is a request that can be sent by an applicant for help with the application process.
 * This is testing that a new help request can be successfully created and that the data for it is being stored
 * properly.
 * 
 * Each it block is a separate test case and titles give a brief description of the purpose of the test.
 */


const dayjs = require('dayjs');
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

describe('Admin dashboard POST help request API', () => {
	let data;
	beforeEach(() => {
		cy.authenticateHelpRequestApi();
		cy.fixture('adminDash').then(function(testData) {
			data = testData;
		});
	});

	it('Verify new help request response format and status', () => {
		let url = Cypress.env("helpRequestUrl");
		let apiKey = Cypress.env("helpRequestXApiKey");
        let token = Cypress.env("token");

		cy.request({
			method: 'POST',
			url: `${url}/applications/${data.helpRequestApplicationId}/help-requests`,
			json: true,
			headers: { 'x-api-key': apiKey, 'Authorization': `Bearer ${token}` },
			body: { 
					'userId': data.userId,
					'helpRequestTopicId': data.helpRequestTopicId,
					'additionalComments': data.helpRequestTextBody,
					'applicantId': data.applicantId,
					'applicationId': data.applicationId
				  }
		}).should((response) => {
			// Verify status
			expect(response.status).to.equal(200);

			// Verify response format
			let body = response.body;
			console.log(JSON.stringify(body));
			expect(body).to.have.own.property('id');
			expect(body).to.have.own.property('helpRequestTopicId');
            expect(body).to.have.own.property('helpStatus', 'NEW'); // Verify status is 'NEW'
            expect(body).to.have.own.property('additionalComments');
			expect(body).to.have.own.property('createdBy');
            expect(body).to.have.own.property('createdDate');
			expect(body).to.have.own.property('modifiedBy');
			expect(body).to.have.own.property('modifiedDate');
            expect(body).to.have.own.property('applicantId');
            expect(body).to.have.own.property('applicationId');
        });
	});

	it('Verify date of creation is current', () => {
		let url = Cypress.env("helpRequestUrl");
		let apiKey = Cypress.env("helpRequestXApiKey");
        let token = Cypress.env("token");
		cy.request({
			method: 'POST',
			url: `${url}/applications/${data.helpRequestApplicationId}/help-requests`,
			json: true,
			headers: { 'x-api-key': apiKey, 'Authorization': `Bearer ${token}` },
			body: { 
					'userId': data.userId,
					'helpRequestTopicId': data.helpRequestTopicId,
					'additionalComments': data.helpRequestTextBody,
					'applicantId': data.applicantId,
					'applicationId': data.applicationId
				  }
		}).should((response) => {
			let body = response.body;
			const date = body['createdDate']; // Format is similar to 2022-04-18T22:59:09.079Z
			const formattedDate = date.substring(0, 16); // Remove everything after minutes
			const today = dayjs().utc().format('YYYY-MM-DDTHH:mm');
			expect(formattedDate).to.equal(today);
		});
	});
});
