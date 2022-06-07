import express from 'express'
import morgan from 'morgan'
import PostController from '#controllers/api/posts.js'
import validate from '#validators/posts.js'

const Post = new PostController
const router = express.Router()

router.get('/', [morgan("combined")], Post.index)
router.get('/:id', [morgan("combined")], Post.show)
router.post('/', [morgan("combined")], validate.create, Post.store)
router.put('/:id', [morgan("combined")], Post.update)
router.delete('/:id', [morgan("combined")], Post.destroy)

export default router
