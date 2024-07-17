const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/User");

passport.use(new LocalStrategy(User.authenticate()));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/oauth2/redirect/google',
  scope: ['profile']
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        username: profile.displayName,
        identity: 'seller'
      });
      await user.save();
    }
    return cb(null, user);
  } catch (err) {
    return cb(err, null);
  }
}));

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));