import express from 'express'
import morgan from 'morgan'
import RoleMatrixController from '../../controllers/api/role-matrix.js'
import validate from '../../validators/role-matrix.js'
import Auth from '../../middlewares/auth.js'
import canAccess from '../../middlewares/canAccess.js'
import verified from '../../middlewares/verified.js'

const RoleMatrix = new RoleMatrixController
const router = express.Router()

router.patch('/assign', [morgan("combined")], Auth, verified, canAccess('create-role-matrix'), validate.create, RoleMatrix.assign)
router.patch('/delete', [morgan("combined")], Auth, verified, canAccess('create-role-matrix'), validate.create, RoleMatrix.delete)

export default router
