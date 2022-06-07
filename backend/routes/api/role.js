import express from 'express'
import morgan from 'morgan'
import RoleController from '../../controllers/api/roles.js'
import validate from '../../validators/role.js'
import Auth from '../../middlewares/auth.js'
import canAccess from '../../middlewares/canAccess.js'
import verified from '../../middlewares/verified.js'

const Role = new RoleController
const router = express.Router()

router.get('/', [morgan("combined")], Auth, verified, canAccess('read-role'), Role.index)
router.get('/:id', [morgan("combined")], Auth, verified, canAccess('read-role'), Role.show)
router.post('/', [morgan("combined")], Auth, verified, canAccess('create-role'), validate.create, Role.store)
router.put('/:id', [morgan("combined")], Auth, verified, canAccess('update-role'), validate.update, Role.update)
router.delete('/:id', [morgan("combined")], Auth, verified, canAccess('delete-role'), Role.destroy)

export default router
