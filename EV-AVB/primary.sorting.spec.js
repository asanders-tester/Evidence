/**
 * This is a test for the administrator dashboard portion of the Avalon Bay project. It is testing the sorting 
 * feature, which will sort the columns of the dashboard in ascending order, descending order, or 'unsorted' which
 * is really based on a variety of factors such as the last updated date.
 * This is testing the functionality of clicking the sorting arrow multiple times and ensuring that the list gets sorted 
 * properly.
 * 
 * Each it block is a separate test case and titles give a brief description of the purpose of the test.
 */


describe("application dashboard sorting", () => {
    before(() => {
        sessionStorage.clear();
        cy.visit(Cypress.env("cloudFrontUrl"));
        // cy.visit('https://dbnr3ar90y4e6.cloudfront.net')
        cy.login();
        cy.get("#avb-filters-community input")
            .click()
            .type("Avalon Clarendon {enter}");
        cy.wait(1500);
        cy.get(".ant-empty").should("not.exist");
    });

    after(() => {
        cy.get(".ant-dropdown-trigger.ant-dropdown-link.cstm-signout-link")
            .click()
            .wait(1500);
        cy.get(".ant-dropdown-menu-title-content > a").click().wait(1500);
        cy.url().should("not.include", "/dashboard");
    });

    const columnIds = [
        ":nth-child(3) > .ant-table-column-sorters",
        "#avb-application-list tbody td.ant-table-cell:nth-child(3)",
        "[data-row-key] > :nth-child(3)",
    ];
    const nameUnsorted = [];
    const communityUnsorted = [];
    let unsortedNames = [];

    it("has unsorted data on load", () => {
        cy.get(columnIds[1]).each((txt) => {
            communityUnsorted.push(txt.text().toLowerCase());
        });
        cy.get(columnIds[2]).each((txt) => {
            nameUnsorted.push(txt.text().toLowerCase());
        });
        cy.wrap(communityUnsorted).then(($cells) => {
            let communityCells = $cells;
            let unsortedCommunity = communityCells
                .filter((c) => c !== "")
                .map((cell) => cell);
            expect(unsortedCommunity).not.to.be.sorted;
        });
        cy.wrap(nameUnsorted).then(($cells) => {
            let nameCells = $cells;
            unsortedNames = nameCells
                .filter((c) => c !== "")
                .map((cell) => cell);
            expect(unsortedNames).not.to.be.sorted;
        });
    });

    it("sorts to ascending order after first click", () => {
        cy.get(columnIds[0]).click().wait(1500);
        const nameAsc = [];
        const communityAsc = [];
        cy.get(columnIds[1]).each((txt) => {
            communityAsc.push(txt.text().toLowerCase());
        });
        cy.wrap(communityAsc).then(($cells) => {
            let communityCells = $cells;
            let ascCommunity = communityCells
                .map((cell) => cell)
                .filter((c) => c !== "");
            let alphaAscComm = ascCommunity
                .filter((c) => c !== "")
                .sort((a, b) => b - a);
            expect(ascCommunity).to.deep.equal(alphaAscComm);
        });

        cy.get(columnIds[2]).each((txt) => {
            nameAsc.push(txt.text().toLowerCase());
        });
        cy.wrap(nameAsc).then(($cells) => {
            let nameCells = $cells;
            let ascNames = nameCells
                .map((cell) => cell)
                .filter((c) => c !== "");
            let alphaAscName = ascNames
                .filter((c) => c !== "")
                .sort((a, b) => b - a);
            expect(ascNames).to.deep.equal(alphaAscName);
        });
    });

    it("sorts to descending after second click", () => {
        cy.log("sort on descending");
        const nameDesc = [];
        cy.get(columnIds[0])
            .click()
            .wait(1500)
            .get(columnIds[1])
            .each((txt) => {
                nameDesc.push(txt.text().toLowerCase());
            });
        cy.wrap(nameDesc).then(($cells) => {
            let communityCells = $cells;
            let descCommunity = communityCells
                .map((cell) => cell)
                .filter((c) => c !== "");
            let alphaDescComm = descCommunity
                .filter((c) => c !== "")
                .sort()
                .reverse();
            expect(descCommunity).to.deep.equal(alphaDescComm);

            expect(descCommunity).to.be.descending;
        });
    });

    it("returns to unsorted after third click", () => {
        cy.get(columnIds[0]).click().wait(1500);
        const nameUnsorted2 = [];
        cy.get(columnIds[2]).each((txt) => {
            nameUnsorted2.push(txt.text().toLowerCase());
        });
        cy.wrap(nameUnsorted2).then(($cells) => {
            let nameCells2 = $cells;
            let unsortedNames2 = nameCells2;
            expect(unsortedNames2).to.not.deep.equal(unsortedNames);
        });
    });
});
