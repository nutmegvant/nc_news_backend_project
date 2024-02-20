const request = require('supertest');
const data = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const db = require('../db/connection.js');
const app = require('../app.js');
const apiEndpointsJSON = require('../endpoints.json')

beforeEach(() => seed(data));
afterAll(() => db.end())

describe('/api/topics', () => {
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
    test('GET:404 sends an appropriate status and error message when given an invalid url', () => {
        return request(app)
        .get('/api/topices')
        .expect(404)
        .then((response) => {
        expect(response.body.msg).toBe('Invalid URL');
        });
    })
})

describe('/api', () => {
    test('returns an object of APIs with their description', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
                expect(response.body.apiData).toEqual(apiEndpointsJSON)
            })
    });
});

describe('/api/articles/:article_id', () => {
    test('GET: 200 an article object with all associated properties', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
            const {article} = response.body
            expect(article.article_id).toBe(1)
            expect(article).toMatchObject({
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
            })
        })
    });
    test('GET:404 sends an appropriate status and error message when provided with a non-existent but valid id', () => {
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then((response) => {
        expect(response.body.msg).toBe('Article does not exist');
        });
    });
    test('GET:400 sends an appropriate status and error message when provided with a invalid id', () => {
        return request(app)
        .get('/api/articles/abc')
        .expect(400)
        .then((response) => {
        expect(response.body.msg).toBe('Bad request');
        });
    })
});

describe('/api/articles', () => {
    test('GET: 200 returns an array of all objects within articles without body property, sotyed in descending order by creation date', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            const {articles} = response.body
            articles.forEach(article => {
                expect(article).toMatchObject({
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
                })
            })
        })
    });
    test('GET:404 sends an appropriate status and error message when given an invalid url', () => {
        return request(app)
        .get('/api/articules')
        .expect(404)
        .then((response) => {
        expect(response.body.msg).toBe('Invalid URL');
        });
    })
})