const Router = require("express");
const router = new Router();
const postController = require("../controllers/postController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const upload = require('../middlewares/upload.js');

router.get("/posts", postController.getPosts);
router.get("/post/:id", postController.getOnePost);
router.post("/addPost", authMiddleware, upload.array('image', 12), postController.addPost);
router.delete("/delpost/:id", authMiddleware, postController.deleteOnePost);
router.patch("/update/:id", authMiddleware, postController.updatePost);
router.get('/user/:id', authMiddleware, postController.getUserPosts);
router.post('/favorites/:postId', authMiddleware, postController.addToFavorites);
router.delete('/favorites/:postId', authMiddleware, postController.removeFromFavorites);
router.get('/favorites', authMiddleware, postController.getFavorites);
router.post('/comment/:id', authMiddleware, postController.addComment);
router.delete('/comment/:postId/:commentId', authMiddleware, postController.deleteComment);
router.patch('/comment/:postId/:commentId', authMiddleware, postController.editComment);
router.post('/message/:id', authMiddleware, postController.sendMessage);
router.get('/seller-chats', authMiddleware, postController.getSellerChats);

module.exports = router;