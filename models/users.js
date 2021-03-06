const sanitizeHTML = require('sanitize-html');
const bcrypt = require('bcrypt-nodejs');
const securityConf = require('../config/security.js');

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');
const jwt = require('jsonwebtoken');

module.exports = function (mongoose) {
    const userSchema = new mongoose.Schema(
        {
            username: {
                type: String,
                unique: true,
                required: [true, 'A user requires a username']
            },
            password: {
                type: String,
                required: [true, 'A user needs a password.']
            },
            role: {
                type: String,
                enum: ['student', 'organiser'],
                required: [true, 'A user needs a role.']
            }
        },
        {
            strict: "throw",
            toObject: {
                versionKey: false
            }
        }
    );
    const User = mongoose.model('User', userSchema);

    // Define how to login
    passport.use('login', new LocalStrategy(securityConf.localOptions, (req, username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) return done(err);

            if (!user) return done(null, false, { message: 'Given username not found.' });

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return done(err);
                if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

                done(null, {
                    username: user.username,
                    token: jwt.sign(user._id.toString(), securityConf.jwtSecret),
                    role: user.role
                });
            });
        });
    }));

    // Define how to register
    passport.use('register', new LocalStrategy(securityConf.localOptions, (req, username, password, done) => {
        var userObj = {};
        userObj.username = username;
        userObj.password = password;
        if (req.body.role && req.body.role != "") {
            userObj.role = req.body.role;
        }
        const user = new User(userObj);
        User.findOne({ username: user.username }, (err, res) => {
            if (err) return done(err);

            if (res) return done(null, false, { message: 'Username taken.' });

            user.save(err => {
                if (err) return done(err);

                done(null, {
                    username: user.username,
                    token: jwt.sign(user._id.toString(), securityConf.jwtSecret),
                    role: user.role
                });
            });
        });
    }));

    // Define how to verify the user identity
    passport.use('verify', new JwtStrategy(securityConf.jwtOptions, (payload, done) => {
        User.findOne({ _id: payload}, (err, user) => {
            if (err) return done(err);

            if (!user) return done(null, false, {error: 'Invalid token'});

            done(null, user);
        });
    }));

    // Hash the password before storing it.
    userSchema.pre('save', function(next) {
        const user = this;
        const SALT_FACTOR = 5;
        if (!user.isModified('password')) return next();

        bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, null, (err, hash) => {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    });
};
