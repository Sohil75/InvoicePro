const CompanyProfile = require("../models/CompanyProfile");

exports.createCompany = async (req,res)=>{
    try{
        console.log("REQ.USER:",req.user);
        const userId = req.user?._id;
        if(!userId){
            return res.status(401).json({message:"User not authenticated"});

        }
        const existing = await CompanyProfile.findOne({
            userId     
        });
        if(existing){
            return res.status(400).json({message:"Company already exists"});
        }
        const company = await CompanyProfile.create({
            userId:userId,
            companyName:req.body.companyName,
            email:req.body.email,
            phone: req.body.phone,
            address:req.body.address,
            logoUrl:req.file ? `/uploads/${req.file.filename}` :"",
        });
        res.status(201).json(company);
    }
    catch(err){
            console.error("CREATE COMPANY ERROR:", err);
        res.status(500).json({message:err.message});
    }
};

exports.getCompany = async (req,res)=>{
    try {
        const company = await CompanyProfile.findOne({
            userId:req.user.id,
        });
        res.json(company);
    } catch (error) {
        res.status(500).json({message:err.message});
    }
};