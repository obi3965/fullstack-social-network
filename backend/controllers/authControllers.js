const jwt = require("jsonwebtoken");
const User = require('../models/User')
const expressJwt = require('express-jwt');

const _ = require('lodash');
const { sendEmail } = require('../helpers');


exports.signup = async (req,res) =>{
  const { email } = req.body
  const userExist = await User.findOne({email: email}) 
      if(userExist){
          return res.status(403).json({
              error: "Email is already exist"
          })
      } 
            const user = new User(req.body)
            
             await user.save()
             user.hashed_password = undefined
             user.salt = undefined
             res.status(200).json(
                 user
             )
}

exports.signin = async (req,res) =>{
     const { email, password } = req.body
    try {
        const user = await User.findOne({email})
         if(user){
           if(user.authenticate(password)){
            const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_TOKEN);
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


  exports.forgotPassword = (req, res) => {
    if (!req.body) return res.status(400).json({ message: 'No request body' });
    if (!req.body.email) return res.status(400).json({ message: 'No Email in request body' });

    console.log('forgot password finding user with that email');
    const { email } = req.body;
    console.log('signin req.body', email);
    // find the user based on email
    User.findOne({ email }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status('401').json({
                error: 'User with that email does not exist!'
            });

        // generate a token with user id and secret
        const token = jwt.sign({ _id: user._id, iss: process.env.APP_NAME }, process.env.JWT_TOKEN);

        // email data
        const emailData = {
            from: 'noreply@node-react.com',
            to: email,
            subject: 'Password Reset Instructions',
            text: `Please use the following link to reset your password: ${
                process.env.CLIENT_URL
            }/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p> <p>${
                process.env.CLIENT_URL
            }/reset-password/${token}</p>`
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ message: err });
            } else {
                sendEmail(emailData);
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
                });
            }
        });
    });
};

// to allow user to reset password
// first you will find the user in the database with user's resetPasswordLink
// user model's resetPasswordLink's value must match the token
// if the user's resetPasswordLink(token) matches the incoming req.body.resetPasswordLink(token)
// then we got the right user

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    User.findOne({ resetPasswordLink }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status('401').json({
                error: 'Invalid Link!'
            });

        const updatedFields = {
            password: newPassword,
            resetPasswordLink: ''
        };

        user = _.extend(user, updatedFields);
        user.updated = Date.now();

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                message: `Great! Now you can login with your new password.`
            });
        });
    });
};

