const express = require('express');
const router = express.Router();
const passport = require('passport');
const securityConf = require('../config/security.js');

module.exports = function (Event) {
    // Fetch all events
    router.get('/events', (request, response) => {
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
    });

    // Create a new event
    router.post('/events', (request, response) => {
        Event.create(request.body, (err, res) => {
            if (err) return response.status(500).send(err);
            response.send(res);
        });
    });

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

    // Delete all events
    router.delete("/events", (request, response) => {
        Event.deleteAll((err, res) => {
            if (err) return response.status(500).send({message: 'Error deleting events.'});
            response.send(res);
        });
    });

    // Register
    router.post('/register', (req, res, next) => {
        passport.authenticate('register', { session: false }, (err, user, info) => {
            if (err) return res.status(500).send({message: 'Error registering user.'});
            if (!user) return res.status(500).send({message: 'User already exists.'});
            return res
                .cookie(securityConf.cookieName, user.token, securityConf.cookieOptions)
                .send(user);
        })(req, res, next);
    });

    // Login
    router.post('/login', (req, res, next) => {
        passport.authenticate('login', { session: false }, (err, user, info) => {
            if (err) return res.status(500).send({message: 'Error authenticating.'});
            if (!user) return res.status(500).send({message: 'No user found.'});
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