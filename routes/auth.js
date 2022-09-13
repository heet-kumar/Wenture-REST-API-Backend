const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

/**
 * Route        /register
 * Request      POST
 * Requirment   body
**/

router.post("/register",async(req,res)=>{
    
    try{
        // generate a hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);

        // create a new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        // save user to Database and return response
        const user = await newUser.save();
        res.status(200).json(user);

    }catch(err){
        res.status(500).json(err);
    }
})

/**
 * Route           /login
 * Request         POST
 * Requirment      Body
**/
router.post("/login",async(req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        !user && res.status(404).json("User Not Found");

        const validPassword = await bcrypt.compare(req.body.password,user.password);
        !validPassword && res.status(400).json("Invalid password");

        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
    }
})


module.exports = router;