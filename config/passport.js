import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";

import User from "../models/userModel.js";
import { config } from "./index.js";

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL,
      userProfileURL: config.google.userProfileURL,
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        { googleId: profile.id, username: profile.displayName },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);
