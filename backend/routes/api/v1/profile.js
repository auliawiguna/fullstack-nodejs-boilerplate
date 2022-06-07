import express from 'express'
import morgan from 'morgan'
import profileController from '#controllers/api/profile.js'
import validateUser from '#validators/user.js'
import Auth from '#middlewares/auth.js'
import verified from '#middlewares/verified.js'

const Profile = new profileController
const router = express.Router()

router.put('/update', [morgan("combined")], Auth, verified, validateUser.profileUpdate, Profile.update)
router.post('/change-avatar', [morgan("combined")], Auth, verified, Profile.changeAvatar)
router.get('/stream-avatar/:id', [morgan("combined")], Profile.streamAvatar)
router.get('/active-sessions', [morgan("combined")], Auth, verified, Profile.activeSessions)

export default router
