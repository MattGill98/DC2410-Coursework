const sanitizeHTML = require('sanitize-html');
const bcrypt = require('bcrypt-nodejs');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const jwt = require('jsonwebtoken');

const jwtSecret = 'turtles';

const passportOptions = {
    passReqToCallback: true
};

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
            name: {
                type: String,
                required: false
            },
            role: {
                type: String,
                enum: ['member', 'student', 'organiser'],
                default: 'member'
            }
        },
        {
            strict: "throw",
            toObject: {
                versionKey: false
            }
        }
    );

    // Define how to login
    passport.use('login', new LocalStrategy(passportOptions,
        (req, username, password, done) => {
            User.findOne({ username: username }, (err, user) => {
                if (err) return done(err);

                if (!user) return done(null, false, { error: "Given username not found." });

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) return done(err);
                    if (!isMatch) return done(null, false, { error: "Incorrect password." });

                    done(null, {
                        name: user.name,
                        token: jwt.sign(user.username, jwtSecret),
                        role: user.role
                    });
                });
            });
        }
    ));

    // Define how to register
    passport.use('register', new LocalStrategy(passportOptions,
        (req, username, password, done) => {
            var userObj = {};
            userObj.username = username;
            userObj.password = password;
            userObj.name = req.body.name;
            const user = new User(userObj);
            User.findOne({ username: user.username }, (err, res) => {
                if (err) return done(err);

                if (res) return done(null, false, { error: "Username taken." });

                user.save(err => {
                    if (err) throw err;

                    done(null, {
                        name: user.name,
                        token: jwt.sign(user.username, jwtSecret),
                        role: user.role
                    });
                });
            });
        }
    ));

    // Hash the password before storing it.
    userSchema.pre('save', function(next) {
        const user = this;
        const SALT_FACTOR = 5;
        if (!user.isModified('password')) return next();

        if (user.name == null || user.name === "") {
            user.name = user.username;
        }

        bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, null, (err, hash) => {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    });

    const User = mongoose.model('User', userSchema);

    return {
        deleteAll: function (callback) {
            User.remove({}, callback);
        },
        readAll: function(callback) {
            User.find({}, [], {}, callback);
        }
    };
};
