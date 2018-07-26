const express = require('express');
const router = express.Router();
const passport = require('passport');

module.exports = function (Event, Picture, User) {

    router.delete('/event/:id', (request, response, next) => {
        passport.authenticate('verify', { session: false }, (err, user, info) => {
            if (err) return response.status(500).send(err);
            if (!user) return response.status(500).send({error: info.message});

            Event.delete(request.params.id, (err, res) => {
                if (err) return response.status(500).send(err);
                response.send(res);
            });
            Picture.delete(request.params.id);
        })(request, response, next);
    });

    return router;
}