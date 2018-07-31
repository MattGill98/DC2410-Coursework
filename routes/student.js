const express = require('express');
const router = express.Router();
const passport = require('passport');

module.exports = function (Event) {

    router.get('/events', (request, response, next) => {

        // If there are no filter or sort parameters, return all events
        if (!request.query.filter && !request.query.sort) {
            return Event.find({}, null, (err, res) => {
                if (err) return response.status(500).send(err);
                response.send(res);
            });
        }

        passport.authenticate('verify', { session: false }, (err, user, info) => {
            if (err) return response.status(500).send({ message: 'Error authenticating.' });
            if (!user) return response.status(500).send({ message: 'You need to be authenticated to perform this action.' });

            if (user.role === 'member') return response.status(500).send({ message: 'Only students and organisers can filter events.' });


            if (request.query.filter == null) {
                request.query.filter = [];
            }
            var conditions = {};
            if (request.query.filter.includes('sport')) {
                conditions.category = 'sport';
            }
            if (request.query.filter.includes('culture')) {
                conditions.category = 'culture';
            }
            if (request.query.filter.includes('other')) {
                conditions.category = 'other';
            }
            if (request.query.filter.includes('me')) {
                conditions.organiser = 'Matt Gill';
            }

            Event.find(conditions, request.query.sort, (err, res) => {
                if (err) return response.status(500).send(err);
                response.send(res);
            });
        })(request, response, next);
    });

    function getSortParameter() {
        return 'whatever';
    }

    function getFilterParameter() {
        return 'whatever';
    }

    return router;
}