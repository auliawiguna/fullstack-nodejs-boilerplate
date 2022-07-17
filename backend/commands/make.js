import fs from 'fs'
import { join } from 'path'
import path from 'path';
import _ from 'lodash';
import {fileURLToPath} from 'url'
import Pluralize from 'pluralize'
import { printTable } from 'console-table-printer'
import chalk from 'chalk'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __stubFolder = `${join(__dirname, '../stubs')}`
const __controllersFolder = `${join(__dirname, '../controllers/api')}`
const __apisFolder = `${join(__dirname, '../routes/api')}`

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
  
  

const controller = async(name, v) => {
  let moduleName = _.startCase(_.camelCase(name)).replace(/ /g, '')

  try {
    //Controller
    
    let controllerText = await fs.readFileSync(`${__stubFolder}/controller.stub`, 'utf8')
    controllerText = await _.replace(controllerText, new RegExp('{ControllerName}', 'g'), moduleName)

    let controllerFile = `${__controllersFolder}/${_.kebabCase(name)}.js`

    await fs.writeFileSync(controllerFile, controllerText)

    console.log(chalk.green(`Creating Controller : ${moduleName} in ${controllerFile}`))

    //Route

    let routeText = await fs.readFileSync(`${__stubFolder}/route.stub`, 'utf8')
    routeText = await _.replace(routeText, new RegExp('{ControllerName}', 'g'), moduleName)
    routeText = await _.replace(routeText, new RegExp('{ControllerFileName}', 'g'), _.kebabCase(name))
    

    let routeFile = `${__apisFolder}/v${v}/${_.kebabCase(name)}.js`

    await fs.writeFileSync(routeFile, routeText)

    console.log(chalk.green(`Creating Route : ${moduleName} in ${routeFile}`))    
  } catch (error) {
    console.error(chalk.red(error.message))
  }
}

const make = {
    controller
}
export default make