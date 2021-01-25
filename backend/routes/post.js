const express = require('express');
const { requireSignin } = require('../controllers/authControllers');
const {create, getPosts, postsByUser, isPoster, updatePost, postById,
  deletePost } = require('../controllers/postController');
const { userById } = require('../controllers/userController');
const { createPostValidation, isRequestValidated } = require('../validator/validate');


const router = express.Router()


router.get('/posts', getPosts);
router.post('/post/new/:userId', requireSignin, createPostValidation, isRequestValidated , create )
router.get('/posts/by/:userId', requireSignin, postsByUser);
router.put('/post/:postId', requireSignin, isPoster, updatePost);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);


router.param('postId', postById)
router.param('userId', userById);

module.exports = router