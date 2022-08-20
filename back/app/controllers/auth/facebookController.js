const passport = require("passport");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const FacebookStrategy = require("passport-facebook").Strategy


exports.siginWithFacebook = async(req , res)=>{
    try {
        passport.use(new FacebookStrategy({
            clientID: "1691012381259206",
            clientSecret: "956315ed6d96041c454a0a89da155f84",
            callbackURL: process.env.FACEBOOK_CALLBACK_URL
          },
          function(accessToken, refreshToken, profile, cb) {
            User.findOrCreate({ facebookId: profile.id }, function (err, user) {
              return cb(err, user , accessToken);
            });
          }
          
        ));
       
      
    }catch(error){
        console.log(error)
    }
}





