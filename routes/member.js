const express = require('express');
const router = express.Router();
const passport = require('passport');

module.exports = function (Event) {

    router.put('/event/:id/interest', (request, response, next) => {
        passport.authenticate('verify', { session: false }, (err, user, info) => {
            if (err) return response.status(500).send({message: 'Error authenticating.'});
            if (!user) return response.status(500).send({message: 'You need to be authenticated to perform this action.'});

            Event.update({_id: request.params.id}, {$addToSet: {interested: user.username}}, (err, res) => {
                if (err) return response.status(500).send({message: 'Error registering interest.'});
                if (!res) return response.status(404).send({message: 'Event didn\'t exist.'});
                response.send(res);
            });
        })(request, response, next);
    });

    router.delete('/event/:id/interest', (request, response, next) => {
        passport.authenticate('verify', { session: false }, (err, user, info) => {
            if (err) return response.status(500).send({message: 'Error authenticating.'});
            if (!user) return response.status(500).send({message: 'You need to be authenticated to perform this action.'});

            Event.update({_id: request.params.id}, {$pull: {interested: user.username}}, (err, res) => {
                if (err) return response.status(500).send({message: 'Error deregistering interest.'});
                if (!res) return response.status(404).send({message: 'Event didn\'t exist.'});
                response.send(res);
            });
        })(request, response, next);
    });

    return router;
}