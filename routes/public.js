const express = require('express');
const router = express.Router();
const passport = require('passport');

module.exports = function (Event, Picture) {
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

        var picturePath = (request.body.picture == null) ? null : request.body.picture.path;
        request.body.picture = false;

        Event.create(request.body, (err, createdEvent) => {
            if (err != null) {
                response.status(500).send(err);
            } else {
                if (picturePath != null) {
                    Picture.create(createdEvent._id.toString(), picturePath, (err, createdPicture) => {
                        if (err != null) return response.status(500).send(err);
                        
                        createdEvent.picture = true;
                        Event.update(createdEvent._id.toString(), createdEvent, (err, res) => {
                            if (err) return response.status(500).send(err);
                            response.send(createdEvent);
                        });
                    });
                } else {
                    response.send(createdEvent);
                }
            }
        });
    });

    // Get a specific event
    router.get('/event/:id', (request, response) => {
        Event.read(request.params.id, (err, res) => {
            if (err) return response.status(500).send(err);
            response.send(res);
        });
    });

    // Get the picture for an event
    router.get('/event/:id/picture', (request, response) => {
        Event.read(request.params.id, (err, res) => {
            if (err != null) {
                response.status(500).send(err);
            } else if (res == null) {
                response.send("No event found.");
            } else if (res.picture) {
                Picture.read(request.params.id, (err, res) => {
                    if (err) {
                        throw new Error(err);
                    } else {
                        res.pipe(response);
                    }
                });
            } else {
                response.sendStatus(404);
            }
        });
    })

    // Delete a specific event
    router.delete('/event/:id', (request, response) => {
        Event.delete(request.params.id, (err, res) => {
            if (err) return response.status(500).send(err);
            response.send(res);
        });
        Picture.delete(request.params.id);
    })

    // Delete all events
    router.delete("/events", (request, response) => {
        Event.deleteAll((err, res) => {
            if (err) return response.status(500).send(err);
            response.send(res);
        });
        Picture.deleteAll();
    });

    // Get all users
    router.get('/users', (request, response) => {
        User.readAll((err, res) => {
            if (err) return response.status(500).send(err);
            response.send(res);
        });
    })

    // Delete all users
    router.delete('/users', (request, response) => {
        User.deleteAll((err, res) => {
            if (err) return response.status(500).send(err);
            response.send(res);
        });
    })

    // Register
    router.post('/register', (req, res, next) => {
        passport.authenticate('register', { session: false }, (err, user, info) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (!user) {
                return res.status(500).send(info);
            }
            return res.send(user);
        })(req, res, next);
    });

    // Login
    router.post('/login', (req, res, next) => {
        passport.authenticate('login', { session: false }, (err, user, info) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (!user) {
                return res.status(500).send(info);
            }
            return res.send(user);
        })(req, res, next);
    });

    return router;
}