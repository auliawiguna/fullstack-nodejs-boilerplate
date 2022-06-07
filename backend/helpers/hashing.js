import crypto from 'node:crypto'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

dotenv.config()

const createHash = (string) => bcrypt.hashSync(string, 10)
const createSha256Hash = (string) => crypto.createHmac('sha256', process.env.APP_KEY).update(string).digest('hex')

const compare = (string, compareString) => bcrypt.compareSync(string, compareString)
const compareSha256Hash = (string, compareString) => Object.is(string, compareString)

export default {createHash, compare, createSha256Hash, compareSha256Hash}