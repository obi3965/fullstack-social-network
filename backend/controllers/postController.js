const Post = require('../models/Post')
const formidable = require('formidable');
const fs = require('fs');
const lodash = require('lodash');




exports.create = async (req,res, next) =>{
      
    try {
       
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not be uploaded'
                });
            }
              let post = new Post(fields)
             req.profile.hashed_password = undefined;
             req.profile.salt = undefined;
             post.postedBy = req.profile

            if (files.photo) {
                post.photo.data = fs.readFileSync(files.photo.path);
                post.photo.contentType = files.photo.type;
            }
       
          const posts = post.save()
        res.json({
            posts:posts
        }); 
      })
    
      
 
    } catch (err) {
        res.status(400).json({
            err: "post not created"
        })
    }
    
}

exports.getPosts = async (req,res) => {
    try {
        const posts = await Post.find()
        .populate("postedBy", "_id name")
        .populate("comments", "text created")
        .populate("comments.postedBy", "_id name")
        .select("_id title body created likes")
        .sort({ created: -1 })
        res.status(200).json({
            posts
        })
    } catch (err) {
        res.status(404).json({
            err:"posts not found"
        })
    }
}