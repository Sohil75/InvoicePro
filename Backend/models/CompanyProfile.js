const mongoose=  require("mongoose");

const companyProfileSchema = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
            unique:true,
        },
        companyName:{
            type:String,
            required:true,
            trim:true,
        },
        email:String,
        phone:String,
        address:String,
        logoUrl:String,

    },
    {timestamps:true}
);

module.exports = mongoose.model("CompanyProfile", companyProfileSchema);
