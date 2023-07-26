const multer = require("multer");
const mime = require("mime-types");


const storage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb(null, "client/public/uploads/");
    },
    filename : function(req, file, cb) {
        cb(null, new Date().toISOString + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {

    const mimetype = mime.lookup(req.file.originalname);
    
        if (
          mimetype !== "image/jpg" &&
          mimetype !== "image/png" &&
          mimetype !== "image/jpeg"
        ) {
          throw Error("fichier invalide");
        }
    
        if (req.file.size > 500000) {
          throw Error("max size");
        }
};

const upload = multer ({
    storage : storage,
    fileFilter : fileFilter
});

module.exports = upload