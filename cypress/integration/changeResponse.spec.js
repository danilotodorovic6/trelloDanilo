/// <reference types="cypress" />
import board from "../fixtures/board.json"

describe("Network stubbing", () => {
    let id;
    it("I can change network response", () => {
        cy.intercept("api/boards", { fixture: "board.json" }).as("fakeBoard");
        cy.visit("/");
        cy.get(board.boardTitle).should("have.text", "Brapoo");
        cy.wait("@fakeBoard").then((intercept) => {
            expect(intercept.response.body[0].name).to.eq("Brapoo");
            expect(intercept.response.statusCode).to.eq(200);
            id = intercept.response.body[0].id;
        });
    });
    // it("Dynamically changing data with intercept", () => {
    //     cy.intercept({
    //         method: 'GET',
    //         url: 'api/boards'
    //       }, (req) => {
    //         req.reply((res) => {
    //             console.log(res);
    //             res.body[0].starred = true
    //           res.body[1].name = 'Something else'
    //           return res
    //         });
    //       });
    //       cy.visit("/");
    // });
    // it("Create board", () => {
    //     cy.intercept({
    //         method: 'POST',
    //         url: 'api/boards'
    //       }, (req) => {
    //         req.reply((res) => {
    //             console.log(res);
    //             res.body[0].name = "afaf";
    //             // res.body[0].starred = 'Something else';
    //           return res
    //         });
    //       });
    //       cy.visit("/");
    // });
    it("delete board", () => {
        cy.request("DELETE", `api/boards/${id}`);
    })
});