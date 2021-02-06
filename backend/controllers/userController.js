const User = require("../models/User");
const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");

exports.userById = (req, res, next, id) => {
  User.findById(id)
    // populate followers and following users array
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      req.profile = user; // adds profile object in req with user info
      next();
    });
};

exports.hasAuthorization = (req, res, next) => {
  let sameUser = req.profile && req.auth && req.profile._id == req.auth._id;
  let adminUser = req.profile && req.auth && req.auth.role === "admin";

  const authorized = sameUser || adminUser;

  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized to perform this action",
    });
  }
  next();
};

//to get all users
exports.allUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(users);
  }).select("name email updated created role");
};

//get a single user
exports.getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

//update the user by userId
exports.updateUser = async (req, res, next) => {
  let form = new formidable.IncomingForm();
  
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    // save user
    let user = req.profile;
    
    user = _.extend(user, fields);

    user.updated = Date.now();
    

    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
     
      res.json(user);
    });
  });
};

//delete a user by UserId
exports.deleteUser = async (req, res, next) => {
  let user = req.profile;
  user.remove((err, user) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({ message: "User deleted successfully" });
  });
};

exports.userPhoto = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set(("Content-Type", req.profile.photo.contentType));
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

exports.findPeople = (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  User.find({ _id: { $nin: following } }, (err, users) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(users);
  }).select("name");
};
