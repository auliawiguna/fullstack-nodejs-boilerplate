import indexRoute from './web/index.js'
import fs from 'fs'
import { join } from 'path'
import path from 'path';
import _ from 'lodash';
import {fileURLToPath} from 'url'
import Pluralize from 'pluralize'
import dotenv from 'dotenv'

const listApiRoute = async (app) => {
  dotenv.config()

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const models = {}
  
  Promise.all(
    (await fs.promises.readdir(`${join(__dirname, '../routes/api')}`))
    .filter(model => model !== 'index.js')
    .map((model) => {
      var fileModel = `${Pluralize(path.parse(model).name.toLowerCase())}`
      models[fileModel] = `./api/${model}`
    })
  )

  if (process.env.NODE_ENV!=='production') {
      console.log('API Route List :')
      console.table(models)            
  }

  for (const [modelName, modelPath] of Object.entries(models)) {
    var model = await import(modelPath)
    app.use(`/api/v1/${modelName}`, model.default)
  }  

  return app
}
 
const listWebRoute = async (app) => {
  dotenv.config()

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const models = {}
  
  Promise.all(
    (await fs.promises.readdir(`${join(__dirname, '../routes/web')}`))
    .map((model) => {
      var fileModel = `${Pluralize(path.parse(model).name.toLowerCase())}`
      models[fileModel] = `./web/${model}`
    })
  )

  if (process.env.NODE_ENV!=='production') {
      console.log('Web Route List :')
      console.table(models)            
  }

  for (const [modelName, modelPath] of Object.entries(models)) {
    let model = await import(modelPath)
    let path = modelName=='index' || modelName=='indices' ? '/' : modelName
    app.use(path, model.default)
  }  

  return app
}
  

export const route = async (app) => {
    await listWebRoute(app)
    await listApiRoute(app)
}

export default route