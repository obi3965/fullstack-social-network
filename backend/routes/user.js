const express = require('express')

const {userById, allUsers, getUser, updateUser, deleteUser, hasAuthorization } = require('../controllers/userController')
const { requireSignin } = require("../controllers/authControllers");

const router = express.Router()



router.get('/users', allUsers)
router.get("/user/:userId", requireSignin, getUser);
router.put("/user/:userId", requireSignin, hasAuthorization, updateUser);
router.delete("/user/:userId", requireSignin, hasAuthorization, deleteUser);

// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);


module.exports = router