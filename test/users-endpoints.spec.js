const knex = require('knex');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users Endpoints', function() {
    let db;
    const testUsers = helpers.makeUsersArray();
    const testUser = testUsers[0];

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

    describe('POST /api/users', () => {
        context('User Validation', () => {

            const requiredFields = ['user_name', 'password']
            requiredFields.forEach(field => {
                const loginInfo = {
                    user_name: testUser.user_name,
                    password: testUser.password,
                };
    
                it(`responds with 400 error when '${field}' is missing`, () => {
                    delete loginInfo[field];
                    return supertest(app)
                        .post('/api/users/')
                        .send(loginInfo)
                        .expect(400, {
                            error: `Missing '${field}' in request body`
                        })
                    ;
                })
            })

            it(`responds with 400 error when password is too short`, () => {
                const loginInfo = {
                    user_name: 'new-user',
                    password: 'short',
                };
                return supertest(app)
                    .post('/api/users/')
                    .send(loginInfo)
                    .expect(400, {
                        error: `Password must be at least 8 characters`
                    })
                ;
            })
            it(`responds with 400 error when password is too long`, () => {
                const loginInfo = {
                    user_name: 'new-user',
                    password: '1'.repeat(73),
                };
                return supertest(app)
                    .post('/api/users/')
                    .send(loginInfo)
                    .expect(400, {
                        error: `Password must be no more than 72 characters`
                    })
                ;
            })
            it(`responds with 400 error when password starts with spaces`, () => {
                const loginInfo = {
                    user_name: 'new-user',
                    password: ' 1234567aA!',
                };
                return supertest(app)
                    .post('/api/users/')
                    .send(loginInfo)
                    .expect(400, {
                        error: `Password cannot start or end with empty spaces`
                    })
                ;
            })
            it(`responds with 400 error when password ends with spaces`, () => {
                const loginInfo = {
                    user_name: 'new-user',
                    password: '1234567aA! ',
                };
                return supertest(app)
                    .post('/api/users/')
                    .send(loginInfo)
                    .expect(400, {
                        error: `Password cannot start or end with empty spaces`
                    })
                ;
            })
            it(`responds with 400 error when password is not complex enough`, () => {
                const loginInfo = {
                    user_name: 'new-user',
                    password: 'aaaaaaaa',
                };
                return supertest(app)
                    .post('/api/users/')
                    .send(loginInfo)
                    .expect(400, {
                        error: `Password must contain at least one each of: upper case, lower case, number, and special character`
                    })
                ;
            })

            it(`responds with 400 error when username already exists`, () => {
                const loginInfo = {
                    user_name: testUser.user_name,
                    password: '1234567aA!',
                };
                return supertest(app)
                    .post('/api/users/')
                    .send(loginInfo)
                    .expect(400, {
                        error: `Username already taken`
                    })
                ;
            })
        })

        context('Happy path', () => {
            it(`responds 201, serialized user, storing bcrypted password`, () => {
                const loginInfo = {
                    user_name: 'new-user',
                    password: '1234567aA!',
                };

                return supertest(app)
                    .post('/api/users')
                    .send(loginInfo)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.not.have.property('password')
                        expect(res.body.user_name).to.eql(loginInfo.user_name)
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                        const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                        const actualDate = new Date(res.body.date_created).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    })
                    .expect(res =>
                        db
                            .from('threeaday_users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.user_name).to.eql(loginInfo.user_name)
                                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                                const actualDate = new Date(row.date_created).toLocaleString()
                                expect(actualDate).to.eql(expectedDate)                
                                return bcrypt.compare(loginInfo.password, row.password)
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true
                            })
                    )
                ;
            })
        })
    })
})