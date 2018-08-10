const express = require('express');
const router = express.Router();
const passport = require('passport');

module.exports = function (Event) {

    // Create a new event
    router.post('/events', (request, response, next) => {
        for (var key in request.body) {
            if (key !== 'picture') {
                request.body[key] = request.sanitize(request.body[key]);
            }
        }
        passport.authenticate('verify', { session: false }, (err, user, info) => {
            if (err) return response.status(500).send({message: 'Error authenticating.'});
            if (!user) return response.status(401).send({ message: 'You need to be authenticated to perform this action.' });

            if (user.role != 'organiser') return response.status(403).send({message: 'Role must be \'organiser\' to create events.'});

            request.body.organiser = user.username;
            Event.create(request.body, (err, res) => {
                if (err) return response.status(500).send(err);
                if (!res) return response.status(500).send({message: 'Error creating event.'});
                response.send(res);
            });
        })(request, response, next);
    });

    // Delete an event
    router.delete('/event/:id', (request, response, next) => {
        passport.authenticate('verify', { session: false }, (err, user, info) => {
            if (err) return response.status(500).send({message: 'Error authenticating.'});
            if (!user) return response.status(401).send({ message: 'You need to be authenticated to perform this action.' });

            if (user.role != 'organiser') return response.status(403).send({message: 'Role must be \'organiser\' to delete events.'});

            Event.delete(request.params.id, (err, res) => {
                if (err) return response.status(500).send({message: 'Error deleting event.'});
                if (!res) return response.status(404).send({message: 'Event didn\'t exist.'});
                response.send(res);
            });
        })(request, response, next);
    });

    // Update an event
    router.patch('/event/:id', (request, response, next) => {
        for (var key in request.body) {
            if (key !== 'picture') {
                request.body[key] = request.sanitize(request.body[key]);
            }
        }
        passport.authenticate('verify', { session: false }, (err, user, info) => {
            if (err) return response.status(500).send({message: 'Error authenticating.'});
            if (!user) return response.status(401).send({ message: 'You need to be authenticated to perform this action.' });

            if (user.role != 'organiser') return response.status(403).send({message: 'Role must be \'organiser\' to update events.'});

            Event.read(request.params.id, (err, res) => {
                if (err) return response.status(500).send(err);
                if (!res) return response.status(404).send({message: 'Event didn\'t exist.'});

                if (res.organiser !== user.username) return response.status(403).send({message: 'You can only update your own events.'});

                Event.patch(request.params.id, request.body, (err, res) => {
                    if (err) return response.status(500).send(err);
                    if (!res) return response.status(404).send({message: 'Event didn\'t exist.'});
                    response.send(res);
                });
            });
        })(request, response, next);
    });

    return router;
}