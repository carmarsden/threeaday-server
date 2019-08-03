const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

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

        it(`responds with 400 error when 'content' is missing`, () => {
            const testEntry = { stub: 'no-content' };
            return supertest(app)
                .post('/api/entries')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(testEntry)
                .expect(400, {
                    error: `Missing 'content' in request body`
                })
            ;
        })

        it('responds 201, creates entry, returns new entry', () => {
            this.retries(3);
            const testEntry = {
                content: 'Test good thing!',
                public: true,
                tag_serenity: true,
            };

            return supertest(app)
                .post('/api/entries')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(testEntry)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.content).to.eql(testEntry.content)
                    expect(res.body.user_id).to.eql(testUser.id)
                    expect(res.headers.location).to.eql(`/api/entries/${res.body.id}`)
                    const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                    const actualDate = new Date(res.body.date_modified).toLocaleString()
                    expect(actualDate).to.eql(expectedDate)
                })
                .expect(res =>
                    db
                        .from('threeaday_entries')
                        .select('*')
                        .where({ id: res.body.id })
                        .first()
                        .then(row => {
                            expect(row.content).to.eql(testEntry.content)
                            expect(row.public).to.eql(testEntry.public)
                            expect(row.tag_serenity).to.eql(testEntry.tag_serenity)
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