const router=require("express").Router();
const req = require("express/lib/request");
const User=require("../models/User");
const Post=require("../models/Post");
const bcrypt=require("bcrypt");
//Update (we use put for updation of user information)
router.put("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id){
        //hash the pass again
        if(req.body.password){
            const salt=await bcrypt.genSalt(10);
            req.body.password=await bcrypt.hash(req.body.password, salt);
        }
    try{
       const updatedUser = await User.findByIdAndUpdate(req.params.id,{
           $set: req.body,
       },{new: true});
       res.status(200).json(updatedUser);
    
    }catch(err){
res.status(500).json(err);
    }
}
else{
    res.status(401).json("You can update only your account!");
}
});
// Delete (we use delete for deletion of user information)
router.delete("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id){
        //we are gonna delete all the old post of user
        try{
             const user = await User.findById(req.params.id);
            try{
                await Post.deleteMany({username: user.username});
                await User.findByIdAndDelete(req.params.id)
                res.status(200).json("User has been deleted...");
            }catch(err){
                res.status(500).json(err);
            }
        }catch(err){
            res.status(404).json("user not found!")
        }
}
else{
    res.status(401).json("You can delete only your account!");
}
});
//Get user
router.get("/:id", async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        //we just dont want the password to be seen
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports=router