import passport from 'passport';
import { Strategy } from 'passport-facebook';
import config from '../../config';

export default function() {
	passport.use( new Strategy({
		clientID: config.facebook.APP_ID,
		clientSecret: config.facebook.APP_SECRET,
		callbackURL: 'http://localhost:3000/auth/facebook/callback',
		passReqToCallback: true
	},
	function(req, accessToken, refreshToken, profile, done){
		const user = {};
		user.id = profile.id;
		user.name = profile.displayName;
		user.accessToken = accessToken;
		done(null, user);
	}));
}