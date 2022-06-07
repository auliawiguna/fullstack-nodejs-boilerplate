import express from 'express'
import morgan from 'morgan'
import IndexController from '../../controllers/web/index.js'

const IndexControllerObj = new IndexController
const router = express.Router()

router.get('/', [morgan("combined")], IndexControllerObj.index)

export default router
