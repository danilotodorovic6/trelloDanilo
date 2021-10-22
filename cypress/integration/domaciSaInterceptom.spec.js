///<reference types = "cypress"/>
import threeLists from "../fixtures/threeLists.json";
import fourBoards from "../fixtures/fourBoards.json";

describe("Stubbing", () => {
    it("Boards stubbing", () => {
        cy.intercept('/api/boards',{fixture : 'fourBoards.json'}).as('stubbedBoards');
        cy.visit("/");
        cy.get('@stubbedBoards').its('response').then((res) => {
            expect(res.body[0].name).to.eq(fourBoards[0].name);
            expect(res.body[0].starred).to.eq(fourBoards[0].starred);
            expect(res.body[1].name).to.eq(fourBoards[1].name);
            expect(res.body[1].starred).to.eq(fourBoards[1].starred);
            expect(res.body[2].name).to.eq(fourBoards[2].name);
            expect(res.body[2].starred).to.eq(fourBoards[2].starred);
            expect(res.body[3].name).to.eq(fourBoards[3].name);
            expect(res.body[3].starred).to.eq(fourBoards[3].starred);
            expect(res.statusCode).to.eq(200);
        });
    });
    it("Changing In progress to starred", () => {
        cy.intercept('/api/boards',{fixture : 'fourBoards.json'}, (req) => {
            req.reply((res) => {
                res.body[1].starred = true;
                return res;
            });
        }).as("starred");
        cy.visit("/");
        cy.get("@starred").its("response").then((res) => {
            //why doesn't this work?
            expect(res.body[1].starred).to.eq(true);
        })
    })
    it("OA board stubbing", () => {
        cy.intercept('/api/boards',{fixture : 'threeLists.json'}).as('stubbedQa');
        cy.visit("/");
        cy.get('@stubbedQa').its('response').then((res) => {
            expect(res.body[0].name).to.eq(fourBoards[2].name);
            expect(res.body[0].lists[0].title).to.eq(threeLists[0].lists[0].title);
            expect(res.body[0].lists[1].title).to.eq(threeLists[0].lists[1].title);
            expect(res.body[0].lists[2].title).to.eq(threeLists[0].lists[2].title);
        });
    });
});