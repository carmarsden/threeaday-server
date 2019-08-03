const express = require('express');
const path = require('path');
const logger = require('../logger');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter
    .post('/', jsonParser, (req, res, next) => {
        const { user_name, password } = req.body;

        for (const field of ['user_name', 'password']) {
            if (!req.body[field]) {
                logger.error(`Missing '${field}' in user registration request`);
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        }

        const passwordError = UsersService.validatePassword(password);
        if (passwordError) {
            logger.error(`User registration failed: invalid password`);
            return res.status(400).json({ error: passwordError })
        }

        UsersService.usernameExists(req.app.get('db'), user_name)
            .then(usernameExists => {
                if (usernameExists) {
                    logger.error(`User registration failed: ${user_name} already taken`);
                    return res.status(400).json({ error: 'Username already taken' })
                }

                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            user_name,
                            password: hashedPassword,
                            date_created: 'now()',
                        };
                        return UsersService.insertUser(req.app.get('db'), newUser)
                            .then(user => {
                                logger.info(`New user created: ${user.user_name}`);
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UsersService.serializeUser(user))
                                ;
                            })
                        ;
                    })
                ;
            })
            .catch(next)
        ;
    })
;

module.exports = usersRouter;