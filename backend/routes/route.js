import fs from 'fs'
import { join } from 'path'
import path from 'path';
import _ from 'lodash';
import {fileURLToPath} from 'url'
import Pluralize from 'pluralize'

const getAllFiles = async (dirPath, arrayOfFiles) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  let files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
  })

  return arrayOfFiles
}

const listApiRoute = async (app) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const routes = {}
  
  const allApiRoute = await getAllFiles(`${join(__dirname, '../routes/api')}`)

  for (const[index, filePath] of Object.entries(allApiRoute)) {
    let urlPath = Pluralize(filePath.replace(__dirname, '').replace('.js', '').toLowerCase())
    var model = await import(filePath)
    app.use(`${urlPath}`, model.default)    
    routes[urlPath] = filePath
  }

  if (process.env.NODE_ENV!=='production') {
      console.log('API Route List :')
      console.table(routes)            
  }

  return app
}
 
const listWebRoute = async (app) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const routes = {}
  
  const allApiRoute = await getAllFiles(`${join(__dirname, '../routes/web')}`)

  for (const[index, filePath] of Object.entries(allApiRoute)) {
    let urlPath = Pluralize(filePath.replace(__dirname, '').replace('.js', '').toLowerCase())
    var model = await import(filePath)
    app.use(`${urlPath}`, model.default)    
    routes[urlPath] = filePath
  }

  if (process.env.NODE_ENV!=='production') {
      console.log('Web Route List :')
      console.table(routes)            
  }

  return app
}
  

export const route = async (app) => {
    await listWebRoute(app)
    await listApiRoute(app)
}

export default route