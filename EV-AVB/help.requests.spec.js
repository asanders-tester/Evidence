/**
 * This is a test for the administrator dashboard portion of the Avalon Bay project. It is testing a help request,
 * which is a request that can be sent by an applicant for help with the application process.
 * This is testing all of the functionality of the help request such as hovering over the request, clicking it, 
 * resolving it, and ensuring it is removed from the list after being resolved.
 * 
 * Each it block is a separate test case and brief descriptions of what the test is doing can be found throughout.
 */


//This includes all tests for admin dashboard FE
describe("Help request modal feature", function () {
    let data;
    // Login into app before each test
    before(function () {
        sessionStorage.clear();
        cy.fixture("adminDash").then(function (testData) {
            data = testData;
        });
        cy.visit(Cypress.env("cloudFrontUrl"));
        cy.login();
        cy.authenticateHelpRequestAPI();
    });

    // Log out of app after each test
    after(function () {
        cy.get(
            ".ant-dropdown-trigger.ant-dropdown-link.cstm-signout-link"
        ).click();
        cy.get(".ant-dropdown-menu-title-content > a").click();
        cy.url().should("not.include", "/dashboard");
    });

    it("Help request tooltip functionality", () => {
        let searchKey = `${data.primarySearchFilter}`;
        cy.get("#react-select-regions-input")
            .focus()
            .type(`${data.selectRegionFilter} {enter}`);
        cy.get("#avb-filters-unit-application-name input").type(searchKey);
        cy.get(".ant-table-tbody")
            .find(".avb-help-request-badge", { timeout: 10000 })
            .first()
            .trigger("mouseover")
            .then(() => {
                cy.get(".ant-tooltip").should("be.visible");

                // Verify user can view list of active help requests
                cy.get(".ant-tooltip .request-flags li")
                    .first()
                    .find(".request-flag-icon")
                    .should("be.visible");
                cy.get(".ant-table-tbody")
                    .find(".avb-help-request-badge")
                    .first()
                    .parentsUntil(".ant-table-row")
                    .parent()
                    .invoke("data", "row-key")
                    .then((applicationId) => {
                        let apiKey = Cypress.env("helpRequestApiKey");
                        let token = Cypress.env("helpRequestToken");
                        let apiURL = Cypress.env("helpRequestApiUrl");
                        cy.request({
                            method: "GET",
                            url: `${apiURL}/applications/${applicationId}/help-requests`,
                            headers: {
                                "x-api-key": apiKey,
                                Authorization: `Bearer ${token}`,
                            },
                        }).then((response) => {
                            let body = response.body.helpRequests.filter(
                                (helpRequests) =>
                                    helpRequests.helpStatus === "NEW"
                            );
                            console.log(JSON.stringify(body));
                            cy.wrap(body).each((data) => {
                                cy.get(".ant-tooltip .request-flags").should(
                                    "contain",
                                    data.helpRequestTopic
                                );
                            });
                        });
                    });
            });
    });

    it("Help request home screen tooltip modal functionality", () => {
        // Get number of help requests
        let helpRequestAmount;
        cy.get(".ant-table-tbody")
            .find(".avb-help-request-badge")
            .first()
            .invoke("text")
            .then((text) => (helpRequestAmount = text));

        // Click on the first help request
        cy.get(".ant-table-tbody")
            .find(".avb-help-request-badge", { timeout: 1000 })
            .first()
            .then(() => {
                // Open the help request modal
                cy.get(".ant-tooltip").should("be.visible");
                cy.get(".ant-tooltip .request-flags li", { timeout: 1000 })
                    .first()
                    .click();
            });

        // Verify help topic is displayed and click the resolve button
        cy.get(".modal-body")
            .first()
            .should("contain", "Topic")
            .and("contain", "Applicant Name")
            .and("contain", "Date Sent")
            .and("contain", "Email")
            .and("contain", "Phone")
            .and("contain", "Additional Comments");
        cy.get('*[class^="btn btn-primary"]').click();

        // Verify user is directed to home screen and confirmation ribbon appears
        cy.get("#avb-admin-dashboard").then(($el) => {
            if ($el.find(".modal-content").length > 0) {
                cy.contains("h2", "Unable to process the Help Request").should(
                    "exist"
                );
                cy.get(".btn.btn-primary").click();

                // Try to resolve again
                cy.get(".ant-table-tbody")
                    .find(".avb-help-request-badge", { timeout: 1000 })
                    .first()
                    .then(() => {
                        // Open the help request modal
                        cy.get(".ant-tooltip").should("be.visible");
                        cy.get(".ant-tooltip .request-flags li", {
                            timeout: 1000,
                        })
                            .first()
                            .click();
                    });
                cy.get('*[class^="btn btn-primary"]').click();
            } else {
                cy.get(".ant-table-tbody")
                    .find(".avb-help-request-badge")
                    .should("exist");
                cy.contains(
                    "div",
                    "The Help Request was successfully resolved",
                    {
                        timeout: 3000,
                    }
                ).should("exist");
            }
        });

        // Get number of help requests and compare to original amount
        cy.reload();
        let newHelpRequestAmount;
        let searchKey = `${data.primarySearchFilter}`;
        cy.get("#react-select-regions-input")
            .focus()
            .type(`${data.selectRegionFilter} {enter}`);
        cy.get("#avb-filters-unit-application-name input").type(searchKey);
        cy.get(".ant-table-tbody", { timeout: 1000 })
            .find(".avb-help-request-badge", { timeout: 10000 })
            .first()
            .invoke("text")
            .then((text) => (newHelpRequestAmount = text));
        cy.then(() => {
            expect(newHelpRequestAmount).to.not.equal(helpRequestAmount);
        });
    });

    it("Help request application details page modal functionality", () => {
        // Verify list of active help requests
        cy.get(".ant-table-tbody")
            .first()
            .find("a")
            .invoke("removeAttr", "target")
            .click();
        cy.get("ul>li", { timeout: 10000 }).each(() => {
            cy.get(".resolve").should("be.visible");
        });

        // Get number of help requests and click to resolve
        cy.get("ul>li").its("length").as("helpRequestAmount");
        cy.get(".help-requests").first().find(".resolve").first().click();

        // Verify help request modal opens when user clicks resolve button
        cy.get(".modal-body").should("be.visible");
        cy.get('*[class^="btn btn-primary"]').click();

        // Verify user is directed to application details page and confirmation ribbon appears
        cy.get(".ant-collapse-header")
            .first()
            .contains("APPLICANT INFORMATION")
            .should("exist");
        cy.get("#avb-application-details").then(($el) => {
            if ($el.find(".modal-content").length > 0) {
                cy.contains("h2", "Unable to process the Help Request").should(
                    "exist"
                );
                cy.get(".btn.btn-primary").click();

                // Try to resolve again
                cy.get(".help-requests")
                    .first()
                    .find(".resolve")
                    .first()
                    .click();
                cy.get(".modal-body").should("be.visible");
                cy.get('*[class^="btn btn-primary"]').click();
            } else {
                cy.contains(
                    "div",
                    "The Help Request was successfully resolved",
                    {
                        timeout: 1000,
                    }
                ).should("exist");

                // Verify help request ribbon has been removed
                cy.reload();
                cy.get("@helpRequestAmount").then((helpRequestAmount) => {
                    cy.get("ul>li").should(
                        "have.length",
                        helpRequestAmount - 1
                    );
                });
            }
        });
    });
});
