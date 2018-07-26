module.exports.jwtSecret = 'turtles';
module.exports.cookieName = 'dc2410';
module.exports.cookieOptions = {
    httpOnly: true
};
module.exports.localOptions = {
    passReqToCallback: true
};
module.exports.jwtOptions = {
    jwtFromRequest: (req) => {
        if (req && req.cookies) {
            return req.cookies[module.exports.cookieName];
        }
        return null;
    },
    secretOrKey: module.exports.jwtSecret
};