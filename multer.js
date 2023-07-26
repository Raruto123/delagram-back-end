const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, path.join(__dirname, "utilisateurs", "uploads")) //utilisateurs/uploads ./client/public/uploads/profil
    },
    filename : (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
}
)

module.exports = storage