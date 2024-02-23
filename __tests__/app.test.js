const request = require("supertest");
const data = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const app = require("../app.js");
const apiEndpointsJSON = require("../endpoints.json");
const jestSorted = require("jest-sorted");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET: /api/topics", () => {
    test("GET: 200 returns an array of all objects within topics", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then((response) => {
                const { topics } = response.body;
                topics.forEach((topic) => {
                    expect(topic).toMatchObject({
                        description: expect.any(String),
                        slug: expect.any(String),
                    });
                });
            });
    });
});

describe("GET: /api", () => {
    test("returns an object of APIs with their description", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then((response) => {
                expect(response.body.apiData).toEqual(apiEndpointsJSON);
            });
    });
});

describe("GET: /api/articles/:article_id", () => {
    test("GET: 200 an article object with all associated properties", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then((response) => {
                const { article } = response.body;
                expect(article.article_id).toBe(1);
                expect(article).toMatchObject({
                    created_at: expect.any(String),
                });
            });
    });
    test("GET:400 sends an appropriate status and error message when provided with a invalid id", () => {
        return request(app)
            .get("/api/articles/abc")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request - type conversion issue");
            });
    });
    test("GET:404 sends an appropriate status and error message when provided with a non-existent but valid id", () => {
        return request(app)
            .get("/api/articles/999")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("Article does not exist");
            });
    });
    test('PATCH: 200 update votes on an article', () => {
        const votes = {inc_votes: 10}
        return request(app)
        .patch("/api/articles/1")
        .send(votes)
        .expect(200)
        .then((response) => {
            const { article } = response.body
            expect(article).toMatchObject({
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                votes: 110 
            });
        })
    });
    test('PATCH: 200 ignores extra properties', () => {
        const votes = {inc_votes: 10, isPointsCool: true}
        return request(app)
        .patch("/api/articles/1")
        .send(votes)
        .expect(200)
        .then((response) => {
            const { article } = response.body
            expect(article).toMatchObject({
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                votes: 110 
            });
        })
    });
    test("PATCH: 404 sends an appropriate status and error message when provided with a non-existent but valid id", () => {
        const votes = {inc_votes: 10}
        return request(app)
        .patch("/api/articles/999")
        .send(votes)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Article does not exist");
            });
    });
    test("PATCH:400 sends an appropriate status and error message when provided with a invalid id", () => {
        const votes = {inc_votes: 10}
        return request(app)
        .patch("/api/articles/abc")
        .send(votes)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad Request - type conversion issue");
            });
    });
    test("PATCH: 400 lacking votes", () => {
        const votes = {}
        return request(app)
        .patch("/api/articles/1")
        .send(votes)
        .expect(400)
        .then((response) => {
                expect(response.body.msg).toBe("Missing votes to update");
            });
        });
        test("PATCH: 400 bad input data type", () => {
            const votes = {inc_votes: 'a'}
            return request(app)
            .patch("/api/articles/1")
            .send(votes)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request - type conversion issue");
            });
        })
});

describe("GET: /api/articles", () => {
    test("GET: 200 returns an array of all objects within articles without body property, sorted in descending order by creation date", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                const { articles } = response.body;
                expect(articles.length).toBe(13);
                articles.forEach((article) => {
                    expect(article).toMatchObject({
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comments_count: expect.any(String),
                    });
                    const articleBody = { body: expect.any(String) };
                    expect(articles).toEqual(
                        expect.not.objectContaining(articleBody)
                    );
                    expect(articles).toBeSorted({ descending: true });
                });
            });
    });
});

describe("GET: /api/articles/:article_id/comments", () => {
    test("GET: 200 returns all comments associated with a specific article_id in ascending order based on creation date", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then((response) => {
                const { comments } = response.body;
                expect(comments.length).toBe(11);
                expect(comments).toBeSorted({ descending: false });
                expect(comments[0]).toMatchObject({
                    comment_id: 9,
                    body: "Superficially charming",
                    author: "icellusedkars",
                    votes: 0,
                    created_at: "2020-01-01T03:08:00.000Z",
                });
            });
    });
    test("GET: 200 Article does not have any comments", () => {
    return request(app)
        .get("/api/articles/13/comments")
        .expect(200)
        .then((response) => {
            expect(response.body.msg).toBe("No comments yet");
        });
    });
    test("POST:201 posting a new comment", () => {
    const newComment = {
        author: "butter_bridge",
        comment: "did  you know that peppa pig is actually vegetarian"
        };
    return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then((response) => {
            expect(response.body.comment.author).toBe(newComment.author);
            expect(response.body.comment.body).toBe(newComment.comment);
            expect(response.body.comment.article_id).toBe(
                1
            );
        });
    });
    test("POST: 201 ignore unnecessary properties", () => {
    const newComment = {
        author: "butter_bridge",
        comment: "did  you know that peppa pig is actually vegetarian?",
        likesVeggies: true,
        };
    return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then((response) => {
            expect(response.body.comment.author).toBe(newComment.author);
            expect(response.body.comment.body).toBe(newComment.comment);
            expect(response.body.comment.article_id).toBe(
                1
            );
        });
    });
    test("POST: 404 Username not found", () => {
    const newComment = {
        author: "peppapig",
        comment: "winner winner chicken dinner",
        };
    return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Object not found - foreign key constraint");
        });
    });
    test('POST 400, invalid ID, e.g. string of "not-an-id"', () => {
    const newComment = {
        author: "peppapig",
        comment: "winner winner chicken dinner",
        };
    return request(app)
        .post("/api/articles/a/comments")
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad Request - type conversion issue");
        });
    });
    test("POST: 404, non existent article ID", () => {
    const newComment = {
        author: "tickle122",
        comment: "winner winner chicken dinner",
    };
    return request(app)
        .post("/api/articles/999/comments")
        .send(newComment)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Object not found - foreign key constraint");
        });
    });
    test("POST: 400 comment lacking body(comment)", () => {
    const newComment = {
        author: "tickle122"
    };
    return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Missing comment body");
        });
    });
    test("POST: 400 comment lacking author in the comment", () => {
    const newComment = {
        comment: "winner winner chicken dinner"
        };
    return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Missing author name in the comment");
        });
});
});

describe("404: Bad Path", () => {
    test("GET:404 sends an appropriate status and error message when given an invalid url", () => {
        return request(app)
            .get("/api/articules")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("Invalid URL");
            });
    });
    test("GET:404 sends an appropriate status and error message when given an invalid url", () => {
        return request(app)
            .get("/api/topices")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("Invalid URL");
            });
    });
});

