import responses from "./response.js"
import fs from 'fs'
import { join } from 'path'
import path from 'path';
import {fileURLToPath} from 'url'
import _ from 'lodash'
import dotenv from 'dotenv'
import sequelize from './../database.js'
import Mailer from './../mail.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Set models to global Variable
 *
 * @return  {mixed}
 */
const listModels = async () => {
  dotenv.config()

  const models = {}
  
  Promise.all(
    (await fs.promises.readdir(`${join(__dirname, '../../models')}`))
    .filter(model => model !== 'index.js')
    .map((model) => {
      var fileModel = `${_.camelCase(path.parse(model).name.toLowerCase())}Model`
      models[fileModel] = `./../../models/${model}`
      // global[fileModel] = import(`./../../models/${model}`)
    })
  )
  for (const [modelName, modelPath] of Object.entries(models)) {
    var model = await import(modelPath)
    global[modelName] = model.default
  }  
  for (const [modelName, modelPath] of Object.entries(models)) {
    var model = await import(modelPath)
    model.default.associate()
  }  
  
  if (process.env.NODE_ENV!=='production') {
    console.log('Models List :')
    console.table(models)            
  }

  return 
}

/**
 * Set repository to global Variable
 *
 * @return  {mixed}
 */
 const listRepository = async () => {
  dotenv.config()

  const models = {}
  
  Promise.all(
    (await fs.promises.readdir(`${join(__dirname, '../../repositories')}`))
    .filter(model => model !== 'index.js')
    .map((model) => {
      var fileModel = `${_.camelCase(path.parse(model).name.toLowerCase())}Repository`
      models[fileModel] = `./../../repositories/${model}`
      // global[fileModel] = import(`./../../models/${model}`)
    })
  )
  models
  for (const [modelName, modelPath] of Object.entries(models)) {
    var model = await import(modelPath)
    global[modelName] = new model.default
  }  
  
  if (process.env.NODE_ENV!=='production') {
    console.log('Repositories List :')
    console.table(models)            
  }

  return 
}

/**
 * Set API Controllers to global Variable
 *
 * @return  {mixed}
 */
 const listApiControllers = async () => {

  const models = {}
  
  Promise.all(
    (await fs.promises.readdir(`${join(__dirname, '../../controllers/api')}`))
    .filter(controller => controller !== 'index.js')
    .map((controller) => {
      var controllerName = `${_.camelCase(path.parse(controller).name.toLowerCase())}Controller`
      models[controllerName] = `./../../controllers/api/${controller}`
    })
  )

  for (const [modelName, modelPath] of Object.entries(models)) {
    var model = await import(modelPath)
    global[modelName] = model.default
  }  

  return 
}

/**
 * Load models
 *
 * @return  {mixed}
 */
 const loadHelpers = async () => {

  const models = {}
  
  Promise.all(
    (await fs.promises.readdir(`${join(__dirname, '../../helpers')}`))
    .filter(model => model !== 'index.js')
    .map((model) => {
      var helperName = `${_.camelCase(path.parse(model).name.toLowerCase())}Helper`
      models[helperName] = `./../../helpers/${model}`
    })
  )

  for (const [modelName, modelPath] of Object.entries(models)) {
    var model = await import(modelPath)
    global[modelName] = model.default
  }  

  return 
}

/**
 * Load constants
 *
 * @return  {mixed}
 */
 const loadContstant = async () => {

  const models = {}
  
  Promise.all(
    (await fs.promises.readdir(`${join(__dirname, '../../constants')}`))
    .filter(model => model !== 'index.js')
    .map((model) => {
      var helperName = `${_.camelCase(path.parse(model).name.toLowerCase())}Constant`
      models[helperName] = `./../../constants/${model}`
    })
  )


  for (const [modelName, modelPath] of Object.entries(models)) {
    var model = await import(modelPath)
    const constNames = model.default
    if (global['constants']==null) {
      global['constants'] = {}
    }
    global['constants'] = Object.assign(global['constants'], constNames)
  }  

  return 
}

const initialiser = async () => {
  global.APIResponses = responses
  await listModels()
  await loadHelpers()
  await loadContstant()
  await listRepository()
  global['SEQUELIZE'] = sequelize
  global['MAILER'] = new Mailer()
  global['BASE_PATH'] = join(__dirname, '../..')
  global['UPLOAD_PATH'] = join(__dirname, '../../uploads')

  if (process.env.NODE_ENV!=='production') {
    console.log('Global Variable :')
    console.log(global)            
    console.log('Global Constant :')
    console.table(global['constants'])            
  }
} 

export default initialiser