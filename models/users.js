const sanitizeHTML = require('sanitize-html');
const bcrypt = require('bcrypt-nodejs');

const passport = require('passport'),  
      LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'email'};

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

    // Explain how to turn user into JWT
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    // Define how to login
    passport.use('login', new LocalStrategy(
        {
            passReqToCallback: true
        },
        (req, username, password, done) => {
            User.findOne({ username: username }, (err, user) => {
                if (err) return done(err);

                if (!user) return done(null, false, { error: "Given username not found." });

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) return done(err);
                    if (!isMatch) return done(null, false, { error: "Incorrect password." });

                    return done(null, user);
                });
            });
        }
    ));

    // Define how to register
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true
        },
        (req, username, password, done) => {
            var userObj = {};
            userObj.username = username;
            userObj.password = password;
            userObj.name = req.params.name;
            const newUser = new User(userObj);
            User.findOne({ username: newUser.username }, (err, user) => {
                if (err) return done(err);

                if (user) return done(null, false, { error: "Username taken." });

                newUser.save(err => {
                    if (err) throw err;

                    done(null, newUser);
                });
            });
        }
    ));

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
