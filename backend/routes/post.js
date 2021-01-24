const express = require('express');
const { requireSignin } = require('../controllers/authControllers');
const {create, getPosts } = require('../controllers/postController');
const { userById } = require('../controllers/userController');
const { createPostValidation, isRequestValidated } = require('../validator/validate');


const router = express.Router()

router.post('/post/new/:userId', requireSignin, isRequestValidated , create )
router.get('/posts', getPosts);


  router.param('userId', userById);

module.exports = router