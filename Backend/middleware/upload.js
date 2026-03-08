const multer = require("multer");
const path = require("path");

const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/");
    },
    filename:(req,file,cb)=>{
        const uniqueName=
        Date.now() + "-" + file.originalname.replace(/\s+/g,"");
        cb(null,uniqueName);
    },
});

const fileFilter =(req,file,cb)=>{
    if(file.mimetype.startsWith("image/")) cb(null,true);
    else cb(new Error("only image files allowed"),false);
};
const upload = multer({storage, fileFilter});

module.exports = upload;