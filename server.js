const express = require('express');
const app = express();

// Configure body parsing
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Configure form processing
const formData = require('express-form-data');
app.use(formData.parse({
    uploadDir: require('os').tmpdir(),
    autoClean: true
}));
app.use(formData.format());
app.use(formData.union());

// Configure passport
const passport = require('passport');
app.use(passport.initialize());

// Deploy OpenAPI
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('yamljs').load('res/openapi.yml');
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Connect to database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');

// Create tables
const User = require('./models/users.js')(mongoose);
const Event = require('./models/events.js')(mongoose);
const Picture = require('./models/pictures.js')(mongoose);

// Fetch all events
app.get('/api/events', (request, response) => {

    // Apply the filters
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

    Event.find(conditions, request.query.sort, getDefaultCallback(response));
});
// Create a new event
app.post('/api/events', (request, response) => {

    var picturePath = (request.body.picture == null)? null : request.body.picture.path;
    request.body.picture = false;

    Event.create(request.body, (err, createdEvent)  => {
        if (err != null) {
            response.status(500).send(err);
        } else {
            if (picturePath != null) {
                Picture.create(createdEvent._id.toString(), picturePath, (err, createdPicture) => {
                    if (err != null) {
                        response.status(500).send(err);
                    } else {
                        createdEvent.picture = true;
                        Event.update(createdEvent._id.toString(), createdEvent, (err, res) => {
                            if (err != null) {
                                response.send(err);
                            } else {
                                response.send(createdEvent);
                            }
                        });
                    }
                });
            } else {
                response.send(createdEvent);
            }
        }
    });
});

// DELETE THIS AFTER 1.0.0
app.delete("/api/events", (request, response) => {
    Event.deleteAll(getDefaultCallback(response));
    Picture.deleteAll();
});

// Get a specific event
app.get('/api/event/:id', (request, response) => {
    Event.read(request.params.id, getDefaultCallback(response));
});

// Update a specific event
app.put('/api/event/:id', (request, response) => {
    Event.update(request.params.id, request.body, getDefaultCallback(response));
})

// Delete a specific event
app.delete('/api/event/:id', (request, response) => {
    Event.delete(request.params.id, getDefaultCallback(response));
    Picture.delete(request.params.id);
})

app.get('/api/event/:id/picture', (request, response) => {
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

app.post('/api/login', (req, res, next) => {
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

app.post('/api/register', (req, res, next) => {
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

app.get('/api/users', (request, response) => {
    User.readAll(getDefaultCallback(response));
})

app.delete('/api/users', (request, response) => {
    User.deleteAll(getDefaultCallback(response));
})

function getDefaultCallback(response) {
    return (err, res) => {
        if (err) {
            response.status(500).send(err);
        } else {
            response.send(res);
        }
    };
} 

module.exports = app;