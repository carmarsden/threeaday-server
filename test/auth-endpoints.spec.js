const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Auth Endpoints', function() {
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


    // BEGIN TEST CASES

    describe('POST /api/auth/login', () => {
        beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

        const requiredFields = ['user_name', 'password']
        requiredFields.forEach(field => {
            const loginInfo = {
                user_name: testUser.user_name,
                password: testUser.password,
            };

            it(`responds with 400 error when '${field}' is missing`, () => {
                delete loginInfo[field];
                return supertest(app)
                    .post('/api/auth/login')
                    .send(loginInfo)
                    .expect(400, {
                        error: `Missing '${field}' in request body`
                    })
                ;
            })
        })

        it('responds with 400 error when bad username', () => {
            const invalidUser = { user_name: 'invalid-name', password: 'password1' };
            return supertest(app)
                .post('/api/auth/login')
                .send(invalidUser)
                .expect(400, { error: 'Incorrect username or password' })
            ;
        })
        it('responds with 400 error when bad password', () => {
            const invalidUser = { user_name: testUser.user_name, password: 'invalid-pass' };
            return supertest(app)
                .post('/api/auth/login')
                .send(invalidUser)
                .expect(400, { error: 'Incorrect username or password' })
            ;
        })

        it('responds with 200 and JWT when credentials valid', () => {
            const validUser = {
                user_name: testUser.user_name,
                password: testUser.password
            };
            const expectedToken = jwt.sign(
                { user_id: testUser.id },
                process.env.JWT_SECRET,
                {
                    subject: testUser.user_name,
                    expiresIn: process.env.JWT_EXPIRY,
                    algorithm: 'HS256',
                }
            );

            return supertest(app)
                .post('/api/auth/login')
                .send(validUser)
                .expect(200, {
                    authToken: expectedToken
                })
            ;
        })
    })

})