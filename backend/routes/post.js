const express = require('express');
const { requireSignin } = require('../controllers/authControllers');
const {createPost, getPosts, postsByUser, isPoster, updatePost, postById,
  deletePost,like, unlike, comment, uncomment, updateComment, singlePost, photo
 } = require('../controllers/postController');
const { userById } = require('../controllers/userController');
const { createPostValidation, isRequestValidated } = require('../validator/validate');


const router = express.Router()


router.get('/posts', getPosts);
router.post('/post/new/:userId', requireSignin, createPostValidation, isRequestValidated , createPost )
router.get('/posts/by/:userId', requireSignin, postsByUser);
router.put('/post/:postId', requireSignin, isPoster, updatePost);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);
router.get('/post/:postId', singlePost);
router.get('/post/photo/:postId', photo);

// like unlike
router.put('/post/like', requireSignin, like);
router.put('/post/unlike', requireSignin, unlike);

//comments
router.post('/post/comment', requireSignin, comment);
router.put('/post/uncomment', requireSignin, uncomment);
router.put('/post/updatecomment', requireSignin, updateComment);

router.param('postId', postById)
router.param('userId', userById);

module.exports = router