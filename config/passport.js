const secret = require("../_helpers/constant").SECRET_OR_KEY
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const config = require("./db");
const User = require("../models/user");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;

module.exports = function(passport) {

  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.get_by_user_id(jwt_payload.user_id, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    })
  );
};
  