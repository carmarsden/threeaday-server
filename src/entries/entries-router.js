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
        const userId = req.user.id;
        console.log('userId: ', userId);

        if (!Array.isArray(req.body)) {
            logger.error(`Post request must be an array of objects`);
            return res.status(400).json({
                error: `Request body must be an array of objects`
            })
        }

        // for each item in array:
        // check that it has "content" key
        // return array where each entry only includes expected list of keys
        
        const requestArray = req.body;

        requestArray.forEach(entry => {
            const { content } = entry;
            if (!content) {
                logger.error(`Missing 'content' in entry post request`);
                return res.status(400).json({
                    error: `Missing 'content' in request body`
                })
            }
        })

        const cleanRequestArray = requestArray.map(entry => {
            return {
                user_id: userId,
                content: entry.content,
                public: entry.public,
                date_modified: entry.date_modified,
                tag_amusement: entry.tag_amusement,
                tag_awe: entry.tag_awe,
                tag_contentment: entry.tag_contentment,
                tag_gratitude: entry.tag_gratitude,
                tag_inspiration: entry.tag_inspiration,
                tag_joy: entry.tag_joy,
                tag_hope: entry.tag_hope,
                tag_love: entry.tag_love,
                tag_pride: entry.tag_pride,
                tag_serenity: entry.tag_serenity,
                tag_other: entry.tag_other
            }
        })

        EntriesService.insertEntries(req.app.get('db'), cleanRequestArray)
            .then(entries => {
                res
                    .status(201)
                    //.location(path.posix.join(req.originalUrl, `/${entry.id}`))
                    .json(EntriesService.serializeEntries(entries))
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