const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
            threeaday_entries,
            threeaday_users
            RESTART IDENTITY CASCADE`
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.user_name,
        algorithm: 'HS256',
    });
    return `Bearer ${token}`;
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

function makeEntriesArray() {
    return [
        {
            id: 1,
            user_id: 1,
            content: 'Good thing number 1',
            public: true,
            date_modified: new Date('2019-01-01T12:20:32.615Z'),
            tag_awe: true,
            tag_other: 'other'
        },
        {
            id: 2,
            user_id: 1,
            content: 'Good thing number 2',
            public: false,
            date_modified: new Date('2019-01-01T12:20:32.615Z'),
            tag_amusement: true,
            tag_other: 'other'
        }, 
        {
            id: 3,
            user_id: 2,
            content: 'Good thing number 3',
            public: true,
            date_modified: new Date('2019-01-01T12:20:32.615Z'),
            tag_contentment: true,
            tag_gratitude: true,
        }, 
        {
            id: 4,
            user_id: 2,
            content: 'Good thing number 4',
            public: false,
            date_modified: new Date('2019-01-01T12:20:32.615Z'),
            tag_inspiration: true,
        }, 
        {
            id: 5,
            user_id: 2,
            content: 'Good thing number 5',
            public: true,
            date_modified: new Date('2019-01-01T12:20:32.615Z'),
            tag_joy: true,
            tag_hope: true,
            tag_love: true,
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

function seedEntries(db, entries) {
    return db.into('threeaday_entries').insert(entries)
        .then(() => 
            // update the auto sequence to stay in sync
            db.raw(
                `SELECT setval('threeaday_entries_id_seq', ?)`,
                [entries[entries.length - 1].id],
            )
        )
    ;
}

module.exports = {
    cleanTables,
    makeAuthHeader,
    makeUsersArray,
    makeEntriesArray,
    seedUsers,
    seedEntries,
}