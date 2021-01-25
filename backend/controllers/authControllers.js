const jwt = require("jsonwebtoken");
const User = require('../models/User')
const expressJwt = require('express-jwt');


exports.signup = async (req,res) =>{

    const { email } = req.body
    
    try {
      const userExist = await User.findOne({email: email}) 
      if(userExist){
          return res.status(403).json({
              error: "Email is already exist"
          })
      } 
            const user = await new User(req.body)
            user.hashed_password = undefined;
            user.salt = undefined;
             await user.save()
             res.status(200).json({
                 user
             })
    } catch (error) {
       return res.status(401).json({
            error:"Email is takeen"
        })
    }
    
}

exports.signin = async (req,res) =>{
     const { email, password } = req.body
    try {
        const user = await User.findOne({email})
         if(user){
           if(user.authenticate(password)){
            const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN);
            res.cookie("t", token, { expire: new Date() + process.env.JWT_EXPIRES_IN });
            const { _id, name, email, role } = user;
            return res.json({ token, user: { _id, email, name, role } });
            } 
         }
         else{
             res.status(401).json({
               status:'not valid email/password'
             })
           }
        } catch (err) {
         return res.status(500).json({
           message:'not valid email/password',
           err:err
         })
        }
    
}

exports.signout = async (req, res) => {
    res.clearCookie('t');
    return res.json({ message: 'Signout success!' });
};


//protecting the route
exports.requireSignin = expressJwt({
    secret: process.env.JWT_TOKEN,
    algorithms: ["HS256"], 
    userProperty: "auth",
  });