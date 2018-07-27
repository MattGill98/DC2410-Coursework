const express = require('express');
const router = express.Router();
const passport = require('passport');

module.exports = function (Event, User) {

    router.delete('/event/:id', (request, response, next) => {
        passport.authenticate('verify', { session: false }, (err, user, info) => {
            if (err) return response.status(500).send(err);
            if (!user) return response.status(500).send({error: info.message});

            Event.delete(request.params.id, (err, res) => {
                if (err) return response.status(500).send(err);
                if (!res) return response.status(404).send({error: 'Event didn\'t exist.'});
                response.send(res);
            });
        })(request, response, next);
    });

    return router;
}