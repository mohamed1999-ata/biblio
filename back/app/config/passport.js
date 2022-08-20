const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../models/user");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

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

passport.use(
	"local-signup",
	new localStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true,
		},

		//verify callback
		async (req, email, password, done) => {

			try {
				// Find the user associated with the email provided by the user
				const existUser = await UserModel.findOne({
					email: req.body.email,
				});

				if (existUser) {
					// If the user is found in the database, return a message
					return done(null, false, {
						message: "User  with provided username already exists",
					});
				}
				// Save the information provided by the user to the the database
				const { firstName, lastName } = req.body;
				const user = await UserModel.create({
					email,
					password,
					firstName,
					lastName
				});
				console.log(user)

				// Send the user information to the next middleware
				return done(null, user, {
					message: "User created Successfully",
				});
			} catch (error) {
				return done(error);
			}
		}
	)
);

// Create a passport middleware to handle User login
passport.use(
	"local-login",
	new localStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			try {
				// Find the user associated with the email provided by the user
				const user = await UserModel.findOne({
					email
				});

				if (!user) {
					// If the user isn't found in the database, return a message
					return done(null, false, {
						message: "User not found",
					});
				}
				// Validate password and make sure it matches with the corresponding hash stored in the database
				// If the passwords match, it returns a value of true.
				const validate = await user.isValidPassword(password);
				if (!validate) {
					return done(null, false, {
						message: "Wrong Password",
					});
				}
				// Send the user information to the next middleware
				return done(null, user, {
					message: "Logged in Successfully",
				});
			} catch (error) {
				return done(error);
			}
		}
	)
);

// This verifies that the token sent by the user is valid
passport.use(
	new JWTstrategy(
		{
			secretOrKey: process.env.PASSPORT_SECRET ,
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
		},
		(jwtPayload, done) => {
			return UserModel.findById({
				_id: jwtPayload.user._id,
			}).then((user, err) => {
				if (err) {
					return done(err, false);
				}
				if (user) {
					return done(null, user);
				} else {
					return done(null, false); // or you could create a new account
				}
			});
		}
	)
);