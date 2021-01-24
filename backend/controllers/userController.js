const User = require("../models/User");
const lodash = require("lodash");
const formidable = require("formidable");
const fs = require("fs");

exports.userById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id)
      .populate("following", "_id name")
      .populate("followers", "_id name");

    req.profile = user;
    next();
  } catch (err) {
    res.status(401).json({
      err: "user is not found",
    });
  }
};

exports.hasAuthorization = async (req, res, next) => {
  let sameUser =
    (await req.profile) && req.auth && req.profile._id == req.auth._id;
  let adminUser = (await req.profile) && req.auth && req.auth.role === "admin";

  const authorized = sameUser || adminUser;

  // console.log("req.profile ", req.profile, " req.auth ", req.auth);
  // console.log("SAMEUSER", sameUser, "ADMINUSER", adminUser);

  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized to perform this action",
    });
  }
  next();
};

//to get all users
exports.allUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email updated created role");
    res.status(200).json({
      users,
    });
  } catch (err) {
    res.status(404).json({
      err: "users not found",
    });
  }
};

//get a single user
exports.getUser = (req, res) => {
  try {
    const singleUser = req.profile;
    res.send(singleUser);
  } catch (err) {
    res.status(404).json({
      err: "single user not found",
    });
  }
};

//update the user by userId
exports.updateUser = async (req, res, next) => {
  try {
    let user = await req.profile;
    user = await lodash.extend(user, req.body);
    user.updated = Date.now();
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    res.status(200).json({
         user 
    });
   
  } catch (err) {
    return res.status(400).json({
      err: "You are not authorized to perform this action",
    });
  }
};


//delete a user by UserId
exports.deleteUser = async (req,res, next) => {
try {
    let user = await req.profile;
     await user.remove()
    res.json({ message: 'User deleted successfully' });
} catch (error) {
    return res.status(400).json({
        error: err
    });
}
}