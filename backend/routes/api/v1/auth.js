import express from 'express'
import morgan from 'morgan'
import authController from '#controllers/api/auth.js'
import validateUser from '#validators/user.js'
import validateSignIn from '#validators/signin.js'
import Auth from '#middlewares/auth.js'

const AuthController = new authController
const router = express.Router()

router.post('/auth-validate', [morgan("combined")], validateUser.validateTokenAuth, AuthController.validateAuth)
router.post('/sign-up', [morgan("combined")], validateUser.signUp, AuthController.signUp)
router.post('/sign-out', [morgan("combined")], Auth, AuthController.signOut)
router.post('/sign-in', [morgan("combined")], validateSignIn.create, AuthController.signIn)
router.post('/validate', [morgan("combined")], validateUser.validateToken, AuthController.validate)
router.get('/change-email/:token', [morgan("combined")], AuthController.finaliseEmailChange)

export default router
