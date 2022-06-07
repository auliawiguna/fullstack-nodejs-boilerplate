import express from 'express'
import morgan from 'morgan'
import PostGroupController from '../../controllers/api/postgroups.js'
import validate from '../../validators/postgroups.js'

const PostGroup = new PostGroupController
const router = express.Router()

router.get('/', [morgan("combined")], PostGroup.index)
router.get('/:id', [morgan("combined")], PostGroup.show)
router.post('/', [morgan("combined")], validate.create, PostGroup.store)
router.put('/:id', [morgan("combined")], validate.update, PostGroup.update)
router.delete('/:id', [morgan("combined")], PostGroup.destroy)

export default router
