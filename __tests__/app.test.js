const request = require('supertest');
const data = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const db = require('../db/connection.js');
const app = require('../app.js');


beforeEach(() => seed(data));
afterAll(() => db.end())

describe('/api/topics', () => {
    test('GET: 200 returns an array of all objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            const {rows} = response.body
            rows.forEach(row => {
                expect(row).toMatchObject({
                    description: expect.any(String),
                    slug: expect.any(String),
                })
            })
        })
    });
})