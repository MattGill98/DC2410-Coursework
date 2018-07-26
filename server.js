const express = require('express');
const app = express();

// Configure body parsing
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Configure cookie parsing
const cookieParser = require('cookie-parser');
app.use(cookieParser());

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

// Add routes
app.use('/api', require('./routes/public.js')(Event, Picture, User));
app.use('/api', require('./routes/member.js')(Event, Picture, User));

module.exports = app;