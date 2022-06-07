import Queue from 'bull'
import dotenv from 'dotenv'

dotenv.config()

const { REDIS_URL, REDIS_PORT, REDIS_PASSWORD } = process.env

// Initiating the Queue with a redis instance
const sendMailQueue = new Queue('sendMail', {
    redis: { 
        host: REDIS_URL, 
        port: REDIS_PORT,
        password: REDIS_PASSWORD
    }
})

export default sendMailQueue