import express from 'express'
import morgan from 'morgan'
import UserController from '#controllers/api/users.js'
import validate from '#validators/user.js'
import Auth from '#middlewares/auth.js'
import canAccess from '#middlewares/canAccess.js'
import verified from '#middlewares/verified.js'

const User = new UserController
const router = express.Router()

router.get('/', [morgan("combined")], Auth, verified, canAccess('read-user'), User.index)
router.get('/:id', [morgan("combined")], Auth, verified, canAccess('read-user'), User.show)
router.post('/', [morgan("combined")], Auth, verified, canAccess('create-user'), validate.create, User.store)
router.put('/:id', [morgan("combined")], Auth, verified, canAccess('update-user'), validate.update, User.update)
router.delete('/:id', [morgan("combined")], Auth, verified, canAccess('delete-user'), User.destroy)

export default router
