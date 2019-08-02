const express = require('express');
const logger = require('../logger');
const AuthService = require('./auth-service');
const requireAuth = require('../middleware/jwt-auth');

const authRouter = express.Router();
const jsonParser = express.json();

authRouter
    .post('/login', jsonParser, (req, res, next) => {
        const { user_name, password } = req.body;
        const loginUser = { user_name, password };

        for (const [key, value] of Object.entries(loginUser)) {
            if (value == null) {
                logger.error(`Missing '${key}' in login request`);
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
            }
        }

        AuthService.getUserWithUsername(req.app.get('db'), loginUser.user_name)
            .then(dbUser => {
                if (!dbUser) {
                    logger.error(`Failed login: user ${loginUser.user_name} not found`);
                    return res.status(400).json({
                        error: 'Incorrect username or password'
                    })
                }
                
                return AuthService.comparePasswords(loginUser.password, dbUser.password)
                    .then(compareMatch => {
                        if (!compareMatch) {
                            logger.error(`Failed login: invalid password`);
                            return res.status(400).json({
                                error: 'Incorrect username or password'
                            })
                        }

                        const sub = dbUser.user_name;
                        const payload = { user_id: dbUser.id };
                        res.send({
                            authToken: AuthService.createJwt(sub, payload)
                        })
                    })
                ;
            })
            .catch(next)
        ;
    })
;

module.exports = authRouter;