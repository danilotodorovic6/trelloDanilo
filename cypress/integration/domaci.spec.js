/// <reference types="cypress" />
import data from "../fixtures/data.json";
import board from "../fixtures/board.json";

describe("", () => {
    it("Visit the page", () => {
        cy.visit("/");
    })
    it("Creating boards", () => {
        for(let i = 0; i < data.boards.length; i++){
            cy.request({
                method: "POST",
                url: "api/boards",
                body: {
                    name: data.boards[i]
                }
            }).as("boardCreated");
            cy.get(board.boardTitle).eq(i).should("have.text", data.boards[i]);
            cy.get("@boardCreated").should((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.name).to.eq(data.boards[i]);
                data.boardIDs.push(response.body.id);
            })
        };
    });
    it("Putting 'In progress' board as favorite", () => {
        cy.get(board.boardItem).contains(data.boards[1]).next().click({force:true});
        cy.get(board.boards).first().should("have.length", 1);
        cy.get(board.favoriteBoard).should("have.text", data.boards[1]);
    });
    it("Adding list items in 'In QA' board", () => {
        cy.get(board.boardItem).contains(data.boards[2]).click();
        cy.url().should("contain", data.boardIDs[2]);
        for(let i = 0; i < data.listTitles.length; i++){
            cy.request({
                method: "POST",
                url: "api/lists",
                body: {
                    boardId: data.boardIDs[2],
                    title: data.listTitles[i]
                }
            }).as("listsCreated");
            cy.get("@listsCreated").should((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.title).to.eq(data.listTitles[i]);              
            });
        }
        cy.get(board.myBoardsButton).click();
    })
    it("Delete boards", () => {
        for(let i = 0; i < data.boards.length; i++){
            cy.request({
                method: "DELETE",
                url: `api/boards/${data.boardIDs[i]}`
            });
            cy.get(board.boardItem).should("have.length", data.boards.length - i - 1);
        }
    })
});