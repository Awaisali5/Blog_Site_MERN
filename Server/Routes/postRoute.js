const { Router } = require("express");

const router = Router();


// auth middlewaare 
const AuthMiddleware = require('../middleware/Authmiddleware')

// importing the controller
const {
  createPost,
  GetSinglePost,
  GetPosts,
  GetCatePost,
  getUserPost,
  editPost,
  deletePost,
} = require("../Controllers/postController");


router.post('/', AuthMiddleware,createPost)
router.get('/', GetPosts)
router.get('/:id', GetSinglePost)
router.get('/categories/:category', GetCatePost)
router.get('/users/:id', getUserPost)
router.patch('/:id', AuthMiddleware,editPost)
router.delete('/:id',AuthMiddleware, deletePost)

module.exports = router;
