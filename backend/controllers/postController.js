const Post = require("../models/Post");
const formidable = require("formidable");
const fs = require("fs");
const lodash = require("lodash");



exports.postById = (req, res, next, id) => {
    Post.findById(id)
        .populate('postedBy', '_id name')
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name role')
        .select('_id title body created likes comments photo')
        .exec((err, post) => {
            if (err || !post) {
                return res.status(400).json({
                    error: err
                });
            }
            req.post = post;
            next();
        });
};

exports.create = async (req, res, next) => {
  try {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          err: "Image could not be uploaded",
        });
      }
      let post = new Post(fields);
      req.profile.hashed_password = undefined;
      req.profile.salt = undefined;
      post.postedBy = req.profile;

      if (files.photo) {
        post.photo.data = fs.readFileSync(files.photo.path);
        post.photo.contentType = files.photo.type;
      }

      const posts = post.save();
      res.json({
        posts: posts,
      });
    });
  } catch (err) {
    res.status(400).json({
      err: "post not created",
    });
  }
};


exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "_id name")
      .populate("comments", "text created")
      .populate("comments.postedBy", "_id name")
      .select("_id title body created likes")
      .sort({ created: -1 });
    res.status(200).json({
      posts,
    });
  } catch (err) {
    res.status(404).json({
      err: "posts not found",
    });
  }

};


exports.postsByUser = async (req, res) => {
  try {
    const postUser = await Post.find({ postedBy: req.profile._id })
      .populate("postedBy", "_id name")
      .select("_id title body created likes")
      .sort("_created");

    res.status(200).json({
      postUser,
    });
  } catch (error) {
    res.status(400).json({
      err: "posts by user is not found",
    });
  }
};


exports.isPoster = async (req, res, next) => {
    let sameUser = req.post && req.auth && req.post.postedBy._id == req.auth._id;
    let adminUser = req.post && req.auth && req.auth.role === 'admin';

    // console.log("req.post ", req.post, " req.auth ", req.auth);
    // console.log("SAMEUSER: ", sameUser, " ADMINUSER: ", adminUser);

    let isPoster = sameUser || adminUser;

    if (!isPoster) {
        return res.status(403).json({
            error: 'User is not authorized'
        });
    }
    next();
};

exports.updatePost = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        // save post
        let post = req.post;
        post = lodash.extend(post, fields);
        post.updated = Date.now();

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    });
};
