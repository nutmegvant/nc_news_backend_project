const request = require('supertest');
const data = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const db = require('../db/connection.js');
const app = require('../app.js');
const apiEndpointsJSON = require('../endpoints.json')
const jestSorted = require('jest-sorted');

beforeEach(() => seed(data));
afterAll(() => db.end())

describe('GET: /api/topics', () => {
    test('GET: 200 returns an array of all objects within topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            const {topics} = response.body
            topics.forEach(topic => {
                expect(topic).toMatchObject({
                    description: expect.any(String),
                    slug: expect.any(String),
                })
            })
        })
    })
})

describe('GET: /api', () => {
    test('returns an object of APIs with their description', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
                expect(response.body.apiData).toEqual(apiEndpointsJSON)
            })
    });
});

describe('GET: /api/articles/:article_id', () => {
    test('GET: 200 an article object with all associated properties', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
            const {article} = response.body
            expect(article.article_id).toBe(1)
            expect(article).toMatchObject({
                created_at: expect.any(String)
            })
        })
    });    
});

describe('GET: /api/articles', () => {
    test('GET: 200 returns an array of all objects within articles without body property, sorted in descending order by creation date', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            const {articles} = response.body
            expect(articles.length).toBe(13)
            articles.forEach(article => {
                expect(article).toMatchObject({
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comments_count: expect.any(String)
                })
                expect(articles).toBeSorted({ descending: true });
            })
        })
    });
});

describe('GET: /api/articles/:article_id/comments', () => {
    test('GET: 200 returns all comments associated with a specific article_id in ascending order based on creation date', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            const {comments} = response.body
            comments.forEach(comment => {
                expect(comment).toMatchObject({
                    comment_id : expect.any(Number),
                    body: expect.any(String),
                    article_id: expect.any(Number),
                    author: expect.any(String),
                    votes: expect.any(Number),
                    created_at: expect.any(String)
                    })
                })
                expect(comments).toBeSorted({ descending: false });
            })
    });
    test('POST:201', () => {
        const newComment = {
            author: 'butter_bridge',
            comment: 'did  you know that peppa pig is actually vegetarian?',
            article_id: 1
            }
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then((response) => {
            expect(response.body.comment.author).toBe(newComment.author);
        expect(response.body.comment.body).toBe(newComment.comment);
        expect(response.body.comment.article_id).toBe(newComment.article_id);
        })
    });
})


describe('Error Handling', () => {
    describe('404: Bad Path', () => {
        test('GET:404 sends an appropriate status and error message when given an invalid url', () => {
        return request(app)
        .get('/api/articules')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid URL');
            })
        });
        test('GET:404 sends an appropriate status and error message when given an invalid url', () => {
            return request(app)
            .get('/api/topices')
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe('Invalid URL');
            });
        });
        test('GET:404 sends an appropriate status and error message when provided with a non-existent but valid id', () => {
            return request(app)
            .get('/api/articles/999')
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe('Article does not exist');
            });
        });
    });
    test('POST: 404 Username not found', () => {
        const newComment = {
            author: 'peppapig',
            comment: 'winner winner chicken dinner',
            article_id: 2
            }
        return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Username not found');
        })
    })
    describe('GET:400 Bad Request', () => {
        test('GET:400 sends an appropriate status and error message when provided with a invalid id', () => {
            return request(app)
            .get('/api/articles/abc')
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
            });
        })
    })
});