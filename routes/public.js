const express = require('express');
const router = express.Router();
const passport = require('passport');
const securityConf = require('../config/security.js');

module.exports = function (Event) {

    // Get a specific event
    router.get('/event/:id', (request, response) => {
        Event.read(request.params.id, (err, res) => {
            if (err) return response.status(500).send({message: 'Error fetching event.'});
            if (!res) return response.status(404).send({message: 'Event not found.'});
            response.send(res);
        });
    });

    // Get the picture for an event
    router.get('/event/:id/picture', (request, response) => {
        Event.readPicture(request.params.id, (err, res) => {
            if (err) return response.status(500).send({message: 'Error finding picture.'});
            if (!res) return response.status(404).send({message: 'Picture not found.'});
            res.pipe(response);
        });
    })

    // Register
    router.post('/register', (req, res, next) => {
        req.body.username = req.sanitize(req.body.username);
        req.body.password = req.sanitize(req.body.password);
        passport.authenticate('register', { session: false }, (err, user, info) => {
            if (err) return res.status(500).send({message: 'Error registering user.'});
            if (!user) return res.status(500).send({message: info.message});
            return res
                .cookie(securityConf.cookieName, user.token, securityConf.cookieOptions)
                .send(user);
        })(req, res, next);
    });

    // Login
    router.post('/login', (req, res, next) => {
        req.body.username = req.sanitize(req.body.username);
        req.body.password = req.sanitize(req.body.password);
        passport.authenticate('login', { session: false }, (err, user, info) => {
            if (err) return res.status(500).send({message: 'Error authenticating.'});
            if (!user) return res.status(500).send({message: info.message});
            return res
                .cookie(securityConf.cookieName, user.token, securityConf.cookieOptions)
                .send(user);
        })(req, res, next);
    });

    // Logout
    router.get('/logout', (request, response) => {
        response.clearCookie(securityConf.cookieName);
        response.send('OK');
    });

    return router;
}