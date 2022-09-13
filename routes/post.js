const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

router.get("/", (req,res)=>{
    console.log("Post Router displayes ");
})

// create a post. 
/**
 * Router           /api/posts/
 * Request          POST
 * Parameters       None
 */
router.post("/", async (req,res)=>{
    const newpost = new Post(req.body);
    try{
        const savedPost = await newpost.save();
        return res.status(200).json(savedPost);
    }catch(err){
        return res.status(500).json(err);
    }
})

// update a post.  
/**
 * Route            /api/posts/:id
 * Request          PUT
 * Parameter        id
 */
router.put("/:id",async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userid === req.body.userid){
            await post.updateOne({
                $set: req.body
            })
            return res.status(200).json("Post Updated successfully");
        }
        else{
            return res.status(403).json("You can only update your post");
        }
    }catch(err){
        return res.status(200).json(err);
    }
})

// delete a post. 
/**
 * Route            /api/posts/:id
 * Request          Delete
 * Parameter        id
 */
router.delete("/:id",async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userid === req.body.userid){
            const deletedpost = await post.deleteOne();
            return res.status(200).json({deletedpost,message: "post deleted successfully"});
        }
        else{
            return res.status(500).json("You can delete your post only");
        }
    }catch(err){
        return res.status(403).json(err);
    }
})

// like and dislike a post. 
/**
 * Request          /api/posts/:id/like.  
 * Route            PUT
 * Parameter        id
 */
router.put("/:id/like",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userid)){
            await post.updateOne({
                $push:{
                    likes: req.body.userid
                }
            })
            return res.status(200).json("Post liked successfully");
        }
        else{
            await post.updateOne({
                $pull:{
                    likes: req.body.userid
                }
            })
            return res.status(200).json("Post has been disliked");
        }
    }catch(err){
        return res.status(500).json(err);
    }

})

// get a post.
/**
 * Route            /api/posts/:id
 * Request          GET
 * Parameter        id
 */ 
router.get("/:id",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        return res.status(200).json(post);
    }catch(err){
        return res.status(500).json(err);
    }
})

// get timeline posts.
/**
 * Route            /api/posts/timeline/all.  
 * Request          GET
 * Parameter        none
 */
router.get("/timeline/all",async(req,res)=>{
    try{
        const curruser = await User.findById(req.body.userid);
        const userposts = await Post.find({userid: curruser._id});
        const friendposts = await Promise.all(
            curruser.followings.map((friendid)=>{
                return Post.find({userid: friendid});
            })
        );
        return res.status(200).json( userposts.concat(...friendposts));
    }catch(err){
        return res.status(500).json(err);
    }
})


module.exports = router;