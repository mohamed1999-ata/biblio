
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		email: {
			type: String,
			unique: true,
		},
		password: {
			type: String
		},
		firstName: {
			type: String,
			minlength: 3,
		},
		lastName: {
			type: String,
			minlength: 3,

		},
		numeroTelephone:{
             type: String 
		},
		 roles: {
           type: [{
              type: String,
              enum: ['user', 'admin']
                 }],
              default: ['user']
           },
		ville :{
			type : String
		},
		adresse :{
			type : String
		}
		
		,ProfilImage : {
            type : String 
		}
		,resetPasswordToken: {
			type: String,
		},
		resetPasswordExpires: {
			type: Date,
		},
		deviceToken : {
			type: String
		},
		provide : {
			type: String ,
			enum : ["google", "facebook" , "local"] ,
			default : "local"
		},
		annonces :[
			{
				type: mongoose.Schema.Types.ObjectId,ref: "Annonce"
			}
		 ] ,
		
	},
	{ timestamps: true }
);

// This is called a pre-hook, before the user information is saved in the database
// this function will be called, we'll get the plain text password, hash it and store it.
UserSchema.pre("save",  function (next) {
	// 'this' refers to the current document about to be saved
	const user = this;
	// Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower
	// your application becomes.
	/*bcrypt.hash(user.password, 10, function(err, hash) {
		if (err) {
		return next(err);
		}
        
		user.password = hash;
		console.log(user)
		next();
	 })*/

	/* const hash = await bcrypt.hash(user.password, 10);
	    user.password = hash;
		console.log(user)
		next();*/

  bcrypt
  .hash(user.password, 10)
  .then((hash) => {
     user.password = hash ;
     next() ;
  })
  .catch((err) => {
    console.log(err);
  });

});

// We'll use this later on to make sure that the user trying to log in has the correct credentials
UserSchema.methods.isValidPassword = async function (password) {
	const user = this;
	// Hashes the password sent by the user for login and checks if the hashed password stored in the
	// database matches the one sent. Returns true if it does else false.
	const compare = await bcrypt.compare(password, user.password);
	return compare;
};

const User = mongoose.model("user", UserSchema);

module.exports = User;