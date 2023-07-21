const router = require("express").Router();
const postController = require("../controllers/post.controller.js");
const path = require("path");
const uploadPath = path.join(__dirname, "..", "client", "public", "uploads", "profil");
const multer = require("multer");
const upload = multer({dest : uploadPath});

router.post("/", upload.single("file"), postController.createPost);
router.get("/", postController.readPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);
router.patch("/like-post/:id", postController.likePost);
router.patch("/unlike-post/:id", postController.unlikePost);

//comments
router.patch("/comment-post/:id", postController.commentPost);
router.patch("/edit-comment-post/:id", postController.editCommentPost);
router.patch("/delete-comment-post/:id", postController.deleteCommentPost);


module.exports = router;