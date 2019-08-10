const express = require('express');
const path = require('path');
const logger = require('../logger');
const EntriesService = require('./entries-service');
const requireAuth = require('../middleware/jwt-auth');

const entriesRouter = express.Router();
const jsonParser = express.json();

entriesRouter
    .route('/')
    .get((req, res, next) => {
        const howMany = req.param('quantity') || 10;
        EntriesService.getSomePublic(req.app.get('db'), howMany)
            .then(entries => {
                res.json(EntriesService.serializeEntries(entries))
            })
            .catch(next)
        ;
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const {
            content,
            public,
            date_modified,
            tag_amusement,
            tag_awe,
            tag_contentment,
            tag_gratitude,
            tag_inspiration,
            tag_joy,
            tag_hope,
            tag_love,
            tag_pride,
            tag_serenity,
            tag_other
        } = req.body;

        if (!req.body.content) {
            logger.error(`Missing 'content' in entry post request`);
            return res.status(400).json({
                error: `Missing 'content' in request body`
            })
        }

        const newEntry = {
            user_id: req.user.id,
            content,
            public,
            date_modified,
            tag_amusement,
            tag_awe,
            tag_contentment,
            tag_gratitude,
            tag_inspiration,
            tag_joy,
            tag_hope,
            tag_love,
            tag_pride,
            tag_serenity,
            tag_other
        };

        EntriesService.insertEntry(req.app.get('db'), newEntry)
            .then(entry => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${entry.id}`))
                    .json(EntriesService.serializeEntry(entry))
                ;
            })
            .catch(next)
        ;
    })
;

entriesRouter
    .route('/byuser')
    .get(requireAuth, (req, res, next) => {
        EntriesService.getByUser(req.app.get('db'), req.user.id)
            .then(entries => {
                res.json(EntriesService.serializeEntries(entries))
            })
            .catch(next)
        ;
    })
;

module.exports = entriesRouter;