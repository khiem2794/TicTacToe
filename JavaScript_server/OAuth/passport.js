import passport from 'passport';
import facebookStrategy from './Strategy/facebook';

export default function(app) {
  app.use(passport.initialize());
  passport.serializeUser(function(user, done) {
  done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
  facebookStrategy();
}