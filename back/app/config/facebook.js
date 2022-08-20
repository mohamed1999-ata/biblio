  const  passport            = require('passport')
  const  FacebookStrategy    = require('passport-facebook').Strategy
  const UserModel = require("../models/user");

  passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		if (err) {
			return cb(err);
		}
		done(null, user);
	});
});

  passport.use(new FacebookStrategy({
    "clientID"        : process.env.FACEBOOK_CLIENT_ID,
    "clientSecret"    :process.env.FACEBOOK_CLIENT_SECRET,
    "callbackURL"     : process.env.FACEBOOK_CALLBACK_URL ,
},
function (token, refreshToken, profile, done) {
    var user = UserModel.findById({_id : profile._id})
    if (user) {
        return done(null, user);
    } else {
      
        const newUser = {
            email : (profile.emails[0].value || '').toLowerCase(),
            firstName : profile.name.givenName,
            lastName : profile.name.familyName,
            provide :  "facebook" ,
            password : "12345678" ,
        }
        console.log(profile);
        return done(null, newUser);
    }
}));
 