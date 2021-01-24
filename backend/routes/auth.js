const express = require('express')

const { signup, signin, signout } = require('../controllers/authControllers')
const { SignUpValidator, SignInRequest, isRequestValidated } = require('../validator/validate')
const {userById} = require('../controllers/userController')

const router = express.Router()

router.post('/signup', SignUpValidator, isRequestValidated, signup)
router.post('/signin', SignInRequest , isRequestValidated, signin)
router.get('/signout', signout)


router.param('userId', userById);

module.exports = router