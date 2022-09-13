const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// update user 
/**
 * Route        /api/users/:id
 * Request      PUT
 * Parameter    id
*/
router.put("/:id", async(req,res) => {
    if(req.body.userid === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
            }catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,
               { $set: req.body, }
            )
            return res.status(200).json("Account has been updated");
        }catch(err){
            return res.status(500).json(err);
        }
    }
    else{
        return res.status(403).json("You can only update only your account");
    }
})

// delete user. 
/**
 * Route            /api/users/:id
 * Request          Delete
 * Parameter        id
 */
router.delete("/:id",async (req,res)=>{
    if(req.body.userid===req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            return res.status(200).json("User Deleted successfully");
        }catch(err){
            return res.status(500).json(err)
        }
    }
    else{
        return res.status(500).json("You can Delete your account only!!!!");
    }
})

// get a user.   
/**
 * Route            /api/users/:id
 * Request          GET
 * Parameter        id
 */
router.get("/:id",async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password, updatedAt, ...other} = user._doc;
        return res.status(200).json({user: other,message: "user found"});
    }catch(err){
        return res.status(500).json(err);
    }
})

// follow a user. 
/**
 * Route            /api/users/:id/follow 
 * Request          PUT
 * Paramenters      id, userid
 */    
router.put("/:id/follow", async(req,res) => {
    if(req.body.userid!==req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userid);
            if(!user.followers.includes(req.body.userid)){
                await user.updateOne({
                    $push: {
                        followers: req.body.userid
                    }
                })
                await currentUser.updateOne({
                    $push:{
                        followings: req.params.id
                    }
                })
                return res.status(200).json("user has been followed");
            }
            else{
                return res.status(403).json("You already follow this user");
            }
        }catch(err){
            return res.status(500).json(err);
        }
    }
    else{
        return res.status(403).json("You cannot follow yourself");
    }
})

// unfollow a user. 
/**
 * Route            /users/:id/unfollow
 * Request          PUT
 * parameter        id, userid
 */  
router.put("/:id/unfollow",async (req,res)=>{
    if(req.params.id !== req.body.userid){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userid);

            if(user.followers.includes(req.body.userid)){
                await user.updateOne({
                    $pull:{
                        followers: req.body.userid
                    }
                })
                await currentUser.updateOne({
                    $pull:{
                        followings: req.params.id
                    }
                })

                return res.status(200).json("Unfollowed the user successfully");
            }
            else{
                return res.status(403).json("You already don't follow this user");
            }
        } catch(err){
            return res.status(500).json(err);
        }
    }
    else{
        return res.status(403).json("You cannot unfollow yourself");
    }
})

module.exports = router;