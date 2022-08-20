const express = require("express");
const passport = require("passport");
const user = require("../../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const multer = require('multer')
const app = express();
const storage = multer.diskStorage({
	destination :  "./public/",
	filename : function(req , file , cb){
		cb(null,    Date.now() + file.originalname);
	}
     })

	 const upload = multer({
		 storage : storage
	 }).single("myImage");

// Registration
exports.signup = async (req, res, next) => {
	passport.authenticate(
		"local-signup",
		{ session: false },
		async (err, user, info) => {
			try {
				if (err || !user) {
					const error = "User with provided username already exists";
					return res.json({
						error,
					});
				} else {
					return res.json({
						message: "Signup successful",
						user: user,
					});
				}
			} catch (error) {
				return next(error);
			}
		}
	)(req, res, next);
};

// Local Login
exports.login = async (req, res, next) => {
	passport.authenticate("local-login", async (err, user, info) => {
		try {
			if (err || !user) {
				const error = "Bad Credentials"; // new Error()
				// return next(error);
				return res.status(400).json({
					error,
				});
			}
			req.login(
				user,
				{
					session: false,
				},
				async (error) => {
					if (error) return next(error);

					// We don't want to store the sensitive information such as the
					// user password in the token so we pick only the email and id
					const payloadObj = {
						_id: user._id,
						email: user.email,
					};

					const expiresIn = "1d";
					// Sign the JWT token and populate the payload with the user email and id
					const token = jwt.sign(
						{
							user: payloadObj,
						},
						process.env.PASSPORT_SECRET,
						{ expiresIn: expiresIn }
					);

					user.password = null;
					// Send back the token to the user
					return res.json({
						token,
						expiresIn,
						user,
					});
				}
			);
		} catch (error) {
			return next(error);
		}
	})(req, res, next);
};

exports.verifyEmailExist = (req, res, next) => {
	if (req.body.email) {
		user.findOne({
			email: req.body.email,
		}).then((user) => {
			if (user) {
				res.status(200).send(true);
			} else res.status(200).send(false);
		});
	} else res.status(400).json("email is mandatory");
};



exports.editUser = async(req , res)=>{
	const id = req.params.id ;
	const data = {
		lastName : req.body.lastName,
		firstName :req.body.firstName ,
		email : req.body.email ,
		numeroTelephone : req.body.numeroTelephone,
		ville : req.body.ville ,
		adresse : req.body.adresse ,
	 };
	await user.updateOne(
        { _id: id},
        data
      ).then(result => {
        if(result){
            res.status(200).send(result);
        }       
        else {
            res.status(500).json({ message: "Error ! update " });
        }
    });





};

  exports.userBYid= async (req , res)=>{
 const id = req.params.id 
     await user.findById({_id : id})
     .then(result=>{
     	if(result){
     		res.status(200).send(result)
     	}else{
     		res.status(500).json({message : "error ! user not found"})
     	}
     }).catch(error=>{
     	res.status(500).send(error.message)
     })	
  }


  exports.uploadImage=   (req, res) => {
	 
	upload (req, res,  (err) => {
		console.log(req.file)
        if (err) {
		res.status(500).json({message :  err})
		 }
	   else {
		if (req.file == undefined) {
		     res.status(500).json({message : "file undefined"})
		} else {
	     user.findByIdAndUpdate(
			    req.params.id,
			{ ProfilImage: req.file.filename },
             { new: true, omitUndefined: true }
	     )
	     .then(user=>{
	     	if (user) {
	     	   return res.status(201).json(user);
	     	}
	     }).catch(err=>{
	     	 return res.status(500).send(err)
	     })

	    }

	    }
	 
	});
  };

