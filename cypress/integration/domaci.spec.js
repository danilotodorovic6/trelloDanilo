/// <reference types="cypress" />

describe("", () => {
    let boards = ["Todo", "In progress", "In QA", "Done"];
    let boardsName;
    let boardIDs = [];
    let listTitles = ["Stubbing network responses", "Changing parts of response data", "Intercepting"];
    it("Visit the page", () => {
        cy.visit("/");
    })
    it("Creating boards", () => {
        for(let i = 0; i < boards.length; i++){
            boardsName = boards[i];
            cy.request({
                method: "POST",
                url: "api/boards",
                body: {
                    name: boardsName
                }
            }).as("boardCreated");
            cy.get("div[data-cy='board-item'] > .board_title").eq(i).should("have.text", boards[i]);
            cy.get("@boardCreated").should((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.name).to.eq(boards[i]);
                boardIDs.push(response.body.id);
            })
        };
    });
    it("Putting 'In progress' board as favorite", () => {
        cy.get("div[data-cy='board-item']").contains("In progress").next().click({force:true});
        cy.get("div[class='board']").first().should("have.length", 1);
        cy.get("div:nth-of-type(1) > .board_item > .board_title").should("have.text", "In progress");
    });
    it("Adding list items in 'In QA' board", () => {
        cy.get("div[data-cy='board-item']").contains("In QA").click();
        cy.url().should("contain", boardIDs[2]);
        for(let i = 0; i < listTitles.length; i++){
            cy.request({
                method: "POST",
                url: "api/lists",
                body: {
                    boardId: boardIDs[2],
                    title: listTitles[i]
                }
            }).as("listsCreated");
            cy.get("@listsCreated").should((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.title).to.eq(listTitles[i]);              
            });
        }
        cy.get(".router-link-active").click();
    })
    it("Delete boards", () => {
        for(let i = 0; i < boards.length; i++){
            boardsName = boards[i];
            cy.request({
                method: "DELETE",
                url: `api/boards/${boardIDs[i]}`
            });
            cy.get("div[data-cy='board-item']").should("have.length", boards.length - i - 1);
        }
    })
});