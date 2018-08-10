const express = require('express');
const router = express.Router();
const passport = require('passport');

module.exports = function (Event) {

    // Register interest for an event
    router.put('/event/:id/interest', (request, response, next) => {
        passport.authenticate('verify', { session: false }, (err, user, info) => {
            if (err) return response.status(500).send({message: 'Error authenticating.'});
            if (!user) return response.status(401).send({message: 'You need to be authenticated to perform this action.'});

            Event.update({_id: request.params.id}, {$addToSet: {interested: user.username}}, (err, res) => {
                if (err) return response.status(500).send({message: 'Error registering interest.'});
                if (!res) return response.status(404).send({message: 'Event didn\'t exist.'});
                response.send(res);
            });
        })(request, response, next);
    });

    // Remove interest for an event
    router.delete('/event/:id/interest', (request, response, next) => {
        passport.authenticate('verify', { session: false }, (err, user, info) => {
            if (err) return response.status(500).send({message: 'Error authenticating.'});
            if (!user) return response.status(401).send({message: 'You need to be authenticated to perform this action.'});

            Event.update({_id: request.params.id}, {$pull: {interested: user.username}}, (err, res) => {
                if (err) return response.status(500).send({message: 'Error deregistering interest.'});
                if (!res) return response.status(404).send({message: 'Event didn\'t exist.'});
                response.send(res);
            });
        })(request, response, next);
    });

    // Get a list of events with filters and sort variables applied
    router.get('/events', (request, response, next) => {
        request.query.filter = request.sanitize(request.query.filter);
        request.query.sort = request.sanitize(request.query.sort);
        request.query.order = request.sanitize(request.query.order);
        request.query.limit = request.sanitize(request.query.limit);
        request.query.offset = request.sanitize(request.query.offset);

        // If there are no filter or sort parameters, return all events
        if (!request.query.filter && !request.query.sort) {
            return Event.find(null, null, null, null, request.query.limit, request.query.offset, (err, results) => {
                if (err) return response.status(500).send(err);
                Event.count(null, null, (err, count) => {
                    if (err) return response.status(500).send(err);
                    response.send({
                        data: results,
                        count: count
                    });
                });
            });
        }

        passport.authenticate('verify', { session: false }, (err, user, info) => {
            if (err) return response.status(500).send({ message: 'Error authenticating.' });
            if (!user) return response.status(401).send({ message: 'You need to be authenticated to perform this action.' });

            Event.find(request.query.filter, request.query.sort, request.query.order, user.username, request.query.limit, request.query.offset, (err, results) => {
                if (err) return response.status(500).send(err);
                Event.count(request.query.filter, user.username, (err, count) => {
                    if (err) return response.status(500).send(err);
                    response.send({
                        data: results,
                        count: count
                    });
                });
            });
        })(request, response, next);
    });

    return router;
}