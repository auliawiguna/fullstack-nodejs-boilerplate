import { Sequelize } from "sequelize"
import dotenv from 'dotenv'

dotenv.config()

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    define: { engine: 'InnoDB' },
    host: process.env.DB_HOST,
    dialect: process.env.DB_DRIVER,
    logging: process.env.NODE_ENV === 'production' ? false : console.log
})

export default sequelize