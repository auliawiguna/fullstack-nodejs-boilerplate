import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import route from './routes/route.js'
import initialiser from './config/init/index.js'
import setTZ from 'set-tz'
import module_alias from 'module-alias/register.js'

dotenv.config()

setTZ(process.env.TZ)

const initFunction = async() => {
    //Init
    await initialiser()

    //Route
    await route(app)
}

const app = express()
app.use(express.json())
app.use(cors())
app.set('trust proxy', true)

initFunction()

app.listen(process.env.PORT, [morgan], () => {
    console.log(`Server run on port ${process.env.PORT}`)
})