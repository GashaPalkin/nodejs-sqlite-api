const Router = require('express')
const router = new Router()
const postController = require('../controllers/post.controller')

router.post('/post', postController.createPost)
router.get('/posts', postController.getPosts)
router.get('/post/:id', postController.getOnePost)
router.put('/post/:id', postController.updatePost)
router.delete('/post/:id', postController.deletePost)

module.exports = router