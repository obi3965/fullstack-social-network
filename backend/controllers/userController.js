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
    res.status(200).json(
      users
    );
  } catch (err) {
    res.status(404).json({
      err: "users not found",
    });
  }
};

//get a single user
exports.getUser = async (req, res) => {
  try {
    const singleUser = await req.profile;
    singleUser.hashed_password = undefined;
    singleUser.salt = undefined;

    res.send(singleUser);
  } catch (err) {
    res.status(404).json({
      err: "single user not found",
    });
  }
};

//update the user by userId
exports.updateUser = async (req, res, next) => {
  // try {
  //   let user = await req.profile;
  //   user = await lodash.extend(user, req.body);
  //   user.updated = Date.now();
  //   await user.save();
  //   user.hashed_password = undefined;
  //   user.salt = undefined;
  //   res.status(200).json({
  //        user 
  //   });
   
  // } catch (err) {
  //   return res.status(400).json({
  //     err: "You are not authorized to perform this action",
  //   });
  // }

  let form = new formidable.IncomingForm();
  // console.log("incoming form data: ", form);
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
      if (err) {
          return res.status(400).json({
              error: 'Photo could not be uploaded'
          });
      }
      // save user
      let user = req.profile;
      // console.log("user in update: ", user);
      user = lodash.extend(user, fields);

      user.updated = Date.now();
      // console.log("USER FORM DATA UPDATE: ", user);

      if (files.photo) {
          user.photo.data = fs.readFileSync(files.photo.path);
          user.photo.contentType = files.photo.type;
      }

      user.save((err, result) => {
          if (err) {
              return res.status(400).json({
                  error: err
              });
          }
          user.hashed_password = undefined;
          user.salt = undefined;
          // console.log("user after update with formdata: ", user);
          res.json(user);
      });
  });
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

exports.userPhoto = (req, res, next) => {
  if (req.profile.photo.data) {
      res.set(('Content-Type', req.profile.photo.contentType));
      return res.send(req.profile.photo.data);
  }
  next();
};


//follow unfollow
exports.addFollowing = async (req,res, next) =>{

  try {
   const result = await User.findOneAndUpdate(req.body.userId, { $push: { following: req.body.followId }})
   res.status(200).json({
     result
   })
   next()
  } catch (error) {
    res.status(400).json({ error: err });
  }
}


exports.addFollower = async (req,res) => {
 
  try {
   const result = await User.findByIdAndUpdate(req.body.followId, { $push: { followers: req.body.userId } }, { new: true })
  .populate('following', '_id name')
  .populate('followers', '_id name')
     result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
  } catch (error) {
     return res.status(400).json({
              error: err
          });
  }
}


exports.removeFollower = async(req,res, next) =>{
 
    try{
      const result = await User.findByIdAndUpdate(req.body.userId, { $pull: { following: req.body.unfollowId } }) 
      res.status(200).json({
        result
      })
      next();
    }catch(error){
      return res.status(400).json({ error: err });
    }
        
}

exports.removeFollowing = async(req,res) =>{
  try {
    const result = await User.findByIdAndUpdate(req.body.unfollowId, { $pull: { followers: req.body.userId } }, { new: true })
    .populate('following', '_id name')
    .populate('followers', '_id name')
    result.hashed_password = undefined;
    result.salt = undefined;
    res.status(200).json({
      result
    })
  } catch (error) {
    return res.status(400).json({ error: err });
  }
}