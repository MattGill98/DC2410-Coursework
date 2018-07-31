const express = require('express');
const router = express.Router();
const passport = require('passport');

module.exports = function (Event) {

    router.get('/events', (request, response, next) => {

        // If there are no filter or sort parameters, return all events
        if (!request.query.filter && !request.query.sort) {
            return Event.find(null, null, null, null, null, null, (err, res) => {
                if (err) return response.status(500).send(err);
                response.send(res);
            });
        }

        passport.authenticate('verify', { session: false }, (err, user, info) => {
            if (err) return response.status(500).send({ message: 'Error authenticating.' });
            if (!user) return response.status(500).send({ message: 'You need to be authenticated to perform this action.' });

            if (user.role !== 'organiser' && user.role !== 'student') return response.status(500).send({ message: 'Only students and organisers can filter events.' });

            Event.find(request.query.filter, request.query.sort, request.query.order, user.username, request.query.limit, request.query.offset, (err, res) => {
                if (err) return response.status(500).send(err);
                response.send(res);
            });
        })(request, response, next);
    });

    return router;
}