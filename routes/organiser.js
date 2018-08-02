const express = require('express');
const router = express.Router();
const passport = require('passport');

module.exports = function (Event) {

    router.post('/events', (request, response, next) => {
        request.body.name = request.sanitize(request.body.name);
        request.body.category = request.sanitize(request.body.category);
        request.body.description = request.sanitize(request.body.description);
        request.body.date = request.sanitize(request.body.date);
        request.body.venue = request.sanitize(request.body.venue);
        passport.authenticate('verify', { session: false }, (err, user, info) => {
            if (err) return response.status(500).send({message: 'Error authenticating.'});
            if (!user) return response.status(500).send({ message: 'You need to be authenticated to perform this action.' });

            if (user.role != 'organiser') return response.status(500).send({message: 'Role must be \'organiser\' to create events.'});

            request.body.organiser = user.username;
            Event.create(request.body, (err, res) => {
                if (err) return response.status(500).send(err);
                if (!res) return response.status(500).send({message: 'Error creating event.'});
                response.send(res);
            });
        })(request, response, next);
    });

    router.delete('/event/:id', (request, response, next) => {
        passport.authenticate('verify', { session: false }, (err, user, info) => {
            if (err) return response.status(500).send({message: 'Error authenticating.'});
            if (!user) return response.status(500).send({ message: 'You need to be authenticated to perform this action.' });

            if (user.role != 'organiser') return response.status(500).send({message: 'Role must be \'organiser\' to delete events.'});

            Event.delete(request.params.id, (err, res) => {
                if (err) return response.status(500).send({message: 'Error deleting event.'});
                if (!res) return response.status(404).send({message: 'Event didn\'t exist.'});
                response.send(res);
            });
        })(request, response, next);
    });

    return router;
}