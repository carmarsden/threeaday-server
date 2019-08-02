const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
    createJwt(subject, payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            expiresIn: config.JWT_EXPIRY,
            algorithm: 'HS256'
        })
    },
    verifyJwt(token) {
        return jwt.verify(token, config.JWT_SECRET, {
            algorithms: ['HS256'],
        })
    },
    getUserWithUsername(db, user_name) {
        return db('threeaday_users')
            .where({ user_name })
            .first()
        ;
    },
    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash)
    },
}

module.exports = AuthService;