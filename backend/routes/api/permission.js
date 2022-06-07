import express from 'express'
import morgan from 'morgan'
import PermissionController from '../../controllers/api/permissions.js'
import validate from '../../validators/permission.js'
import Auth from '../../middlewares/auth.js'
import canAccess from '../../middlewares/canAccess.js'
import verified from '../../middlewares/verified.js'

const Permission = new PermissionController
const router = express.Router()

router.get('/', [morgan("combined")], Auth, verified, canAccess('read-permission'), Permission.index)
router.get('/:id', [morgan("combined")], Auth, verified, canAccess('read-permission'), Permission.show)
router.post('/', [morgan("combined")], Auth, verified, canAccess('create-permission'), validate.create, Permission.store)
router.put('/:id', [morgan("combined")], Auth, verified, canAccess('update-permission'), validate.update, Permission.update)
router.delete('/:id', [morgan("combined")], Auth, verified, canAccess('delete-permission'), Permission.destroy)

export default router
