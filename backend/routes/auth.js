const express = require('express')

const { signup, signin, signout,  forgotPassword, resetPassword } = require('../controllers/authControllers')
const { SignUpValidator, SignInRequest, isRequestValidated, passwordResetValidator } = require('../validator/validate')
const {userById} = require('../controllers/userController')

const router = express.Router()

router.post('/signup', SignUpValidator, isRequestValidated, signup)
router.post('/signin', SignInRequest , isRequestValidated, signin)
router.get('/signout', signout)

// password forgot and reset routes
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', passwordResetValidator, resetPassword);



router.param('userId', userById);

module.exports = router