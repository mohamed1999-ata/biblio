const userModel = require("../../models/user");
const nodemailer = require('nodemailer');
const crypto = require('crypto') ;
const bcrypt = require('bcrypt') ;

exports.forget= async(req , res )=>{
  console.log(req.body.email)
    
    try{
      let user = await userModel.findOne({email : req.body.email}) ;
      if (user) {
        const token =  crypto.randomBytes(32).toString('hex') ;
       await  userModel.updateOne({
             email : req.body.email ,    
         } ,
         {
            resetPasswordToken : token ,
            resetPasswordExpires : Date.now() + 3600000
         }
         )
      const transporter =nodemailer.createTransport({
          host : process.env.PORT ,
          service : process.env.SERVICE,
          port : 587 ,
          secure : true ,
          auth : {
              user : process.env.EMAIL_ADRESS ,
              pass : process.env.PASSWORD
          }
      }) ;
      const mailOptions = {
        from: `${process.env.EMAIL_ADRESS}`,
        to: `${user.email}`,
        subject: "[Pfe projet] - Changement de mot de passe",
        html:  "<h1>Mot de passe oublié ?</h1><p> Vous pouvez réinitialiser votre mot de passe en cliquant sur le bouton suivant. \n" + 
       `<a href="http://localhost:4200/auth/reset/${token}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: "Source Sans Pro", Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Changer mon mot de passe</a>` 
      + "\n <h3> pfe Projet team </h3>"   
      }
      await transporter.sendMail(
          mailOptions ,
          (error)=>{
              if(error) {
                console.log(error)
                  res.status(400).send(error)
              }
              else{
                res.send({message : "email send successfully"}) ;         
            }
          }
      ) 
        }
        else{
          return res.status(400).send("user with given email not found") ; 
        }
      
    }catch(error){
     console.log(error)
     
    }
    

   

}

exports.updatePasswordViaEmail =  async(req , res )=>{
    try{
      console.log(req.body)
     let user = userModel.findOne({
        resetPasswordToken : req.params.token ,
        resetPasswordExpires  :{ $gte: Date.now() }
     }) ;
      if(!user) return res.status(404).json("Password reset token is invalid or has expired.");

       const hashedPassword =  await bcrypt.hash(req.body.password , 10) ;
        await userModel.updateOne({ resetPasswordToken : req.params.token  },
          { password : hashedPassword ,
            resetPasswordToken : null ,
            resetPasswordExpires : null 
          } 
          ) ;
        console.log(hashedPassword) ;
        res.status(200).send({message : "password updated"}) ;
    }catch(error){
    console.log(error)
    }
}