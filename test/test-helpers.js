const bcrypt = require('bcryptjs');

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
            threeaday_entries,
            threeaday_users
            RESTART IDENTITY CASCADE`
    )
}

function makeUsersArray() {
    return [
        {
            id: 1,
            user_name: 'test-user-1',
            password: 'password1',
            date_created: new Date('2019-01-01T12:20:32.615Z'),
        },
        {
            id: 2,
            user_name: 'test-user-2',
            password: 'password2',
            date_created: new Date('2019-01-01T12:20:32.615Z'),
        },
        {
            id: 3,
            user_name: 'test-user-3',
            password: 'password3',
            date_created: new Date('2019-01-01T12:20:32.615Z'),
        },
        {
            id: 4,
            user_name: 'test-user-4',
            password: 'password4',
            date_created: new Date('2019-01-01T12:20:32.615Z'),
        },
    ]
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }));

    return db.into('threeaday_users').insert(preppedUsers)
        .then(() => 
            // update the auto sequence to stay in sync
            db.raw(
                `SELECT setval('threeaday_users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
    ;
}

module.exports = {
    cleanTables,
    makeUsersArray,
    seedUsers,
}