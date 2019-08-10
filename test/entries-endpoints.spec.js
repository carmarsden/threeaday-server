const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const EntriesService = require('../src/entries/entries-service');

describe('Entries Endpoints', function() {
    let db;
    const testUsers = helpers.makeUsersArray();
    const testUser = testUsers[0];
    const testEntries = helpers.makeEntriesArray();

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    });
    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));
    afterEach('cleanup', () => helpers.cleanTables(db));

    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));


    // BEGIN TEST CASES

    describe('GET /api/entries', () => {
        beforeEach('insert entries', () => helpers.seedEntries(db, testEntries));

        it('responds with entries on get request', () => {
            const expectedEntries = testEntries
                .filter(entry => entry.public === true)
                .sort(function(a, b) {
                    return new Date(b.date_modified) - new Date(a.date_modified)
                })
                .slice(0,10)
            ;
            const expectedOutput = EntriesService.serializeEntries(expectedEntries);
            return supertest(app)
                .get('/api/entries')
                .expect(200, expectedOutput)
            ;
        })

        it('respects "quantity" get request parameter', () => {
            const expectedEntries = testEntries
                .filter(entry => entry.public === true)
                .sort(function(a, b) {
                    return new Date(b.date_modified) - new Date(a.date_modified)
                })
                .slice(0,2)
            ;
            const expectedOutput = EntriesService.serializeEntries(expectedEntries);
            return supertest(app)
                .get('/api/entries?quantity=2')
                .expect(200, expectedOutput)
            ;
        })
    })

    describe('POST /api/entries', () => {
        it(`responds with 401 error when posting without JWT`, () => {
            const testEntry = { content: 'new entry' };
            return supertest(app)
                .post('/api/entries')
                .send(testEntry)
                .expect(401, {
                    error: `Missing bearer token`
                })
            ;
        })

        it(`responds with 400 error when submission is not an array`, () => {
            const testEntry = { stub: 'no-content' };
            return supertest(app)
                .post('/api/entries')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(testEntry)
                .expect(400, {
                    error: `Request body must be an array of objects`
                })
            ;
        })

        it(`responds with 400 error when 'content' is missing`, () => {
            const testEntry = [{ stub: 'no-content' }];
            return supertest(app)
                .post('/api/entries')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(testEntry)
                .expect(400, {
                    error: `Missing 'content' in request body`
                })
            ;
        })

        it('responds 201, creates new entries, returns new entries', () => {
            this.retries(3);
            const testEntries = [
                {
                    content: 'Test good thing!',
                    public: true,
                    tag_serenity: true,
                },
                {
                    content: 'This is another!',
                    public: false,
                    tag_awe: true,
                }
            ];

            return supertest(app)
                .post('/api/entries')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(testEntries)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.have.lengthOf(2)
                    expect(res.body[0]).to.have.property('id')
                    expect(res.body[0].content).to.eql(testEntries[0].content)
                    expect(res.body[0].user_id).to.eql(testUser.id)
                    const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                    const actualDate = new Date(res.body[0].date_modified).toLocaleString()
                    expect(actualDate).to.eql(expectedDate)
                })
                .then(res =>
                    db
                        .from('threeaday_entries')
                        .select('*')
                        .where({ id: res.body[0].id })
                        .first()
                        .then(row => {
                            expect(row.content).to.eql(testEntries[0].content)
                            expect(row.public).to.eql(testEntries[0].public)
                            expect(row.tag_serenity).to.eql(testEntries[0].tag_serenity)
                            expect(row.user_id).to.eql(testUser.id)
                            const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                            const actualDate = new Date(row.date_modified).toLocaleString()
                            expect(actualDate).to.eql(expectedDate)
                        })
                )
            ;
        })

    })
})