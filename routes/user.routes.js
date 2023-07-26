const router = require("express").Router();
const authController = require("../controllers/auth.controller.js")
const userController = require("../controllers/user.controller.js")
const uploadController = require("../controllers/upload.controller.js")
const path = require("path");
// const uploadPath = path.join( ".", "utilisateurs", "uploads", "posts")
// const multer = require("multer");
// // const storage = multer.memoryStorage();
// const upload = multer({dest : uploadPath})
// // const upload = multer({storage});
const upload = require("../middleware/multer.js")


// si on se rend sur api/users/register on déclenche la fonction authController.signUp
//auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

//user database
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/follow/:id", userController.follow);
router.patch("/unfollow/:id", userController.unfollow);

//upload files
router.post("/upload", upload.single("file"), uploadController.uploadProfil)

module.exports = router;