const express = require('express');
const app = express();
const path = require('path');

// Serve React files
app.use(express.static(path.join(__dirname, 'client/build')));

// Configure helmet
const helmet = require('helmet');
app.use(helmet());

// Configure sanitizer
const expressSanitizer = require('express-sanitizer');
app.use(expressSanitizer());

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
if (process.env.DATABASE_PASSWORD) {
    mongoose.connect('mongodb://MattGill98:' + process.env.DATABASE_PASSWORD + '@ds111082.mlab.com:11082/dc2410');
} else {
    mongoose.connect('mongodb://localhost:27017');
}

// Create tables
const User = require('./models/users.js')(mongoose);
const Event = require('./models/events.js')(mongoose);

// Add routes
app.use('/api', require('./routes/public.js')(Event));
app.use('/api', require('./routes/student.js')(Event));
app.use('/api', require('./routes/organiser.js')(Event));

module.exports = app;

// Redirect unknown requests to the frontend.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});