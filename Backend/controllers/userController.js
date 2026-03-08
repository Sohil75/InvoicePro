const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.changePassword  = async(req,res)=>{
    try{
        const {currentPassword, newPassword} = req.body;
        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(currentPassword,user.password);

        if(!isMatch)
        {
            return res.status(400).json({message:"current password is incorrect"});
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword,salt);
        await user.save();
        res.json({message:"Password updated successfully"});
    }
    catch(err){
        res.status(500).json({err:"Server error"})
    }
}