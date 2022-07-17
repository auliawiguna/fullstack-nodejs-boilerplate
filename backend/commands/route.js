import fs from 'fs'
import { join } from 'path'
import path from 'path';
import _ from 'lodash';
import {fileURLToPath} from 'url'
import Pluralize from 'pluralize'
import { printTable } from 'console-table-printer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
  
  

const routeList = async() => {
    const routes = []

    const allApiRoute = await getAllFiles(`${join(__dirname, '../routes/api')}`)
    
    for (const[index, filePath] of Object.entries(allApiRoute)) {
        let urlPath = Pluralize(filePath.replace(`${join(__dirname, '../routes')}`, '').replace('.js', '').toLowerCase())
        var model = await import(filePath)
        model.default.stack.forEach(function(r){
        if (r.route && r.route.path){
                routes.push({
                    'URL' : `${urlPath}/${r.route.path}`,
                    'Source Code' : filePath,
                    'Methods' : Object.keys(r.route.methods)
                })
            }
        })      
    }

    printTable(routes)

}

const route = {
    routeList
}
export default route