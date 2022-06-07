import util from 'util'
import multer from 'multer'
import path from 'path';
import { join } from 'path'
import {fileURLToPath} from 'url'
import fs from 'fs'
import exifremove from 'exifremove'

const maxSize = 2 * 1024 * 1024;
const __filename = fileURLToPath(import.meta.url)
const uploadPath = join(path.dirname(__filename), '../uploads')

let storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    let yearFolder = join(uploadPath, new Date().getFullYear().toString())
    if (!fs.existsSync(yearFolder)){
      await fs.mkdirSync(yearFolder)  
    }  
  
    let monthFolder = join(yearFolder, new Date().getMonth().toString())
    if (!fs.existsSync(monthFolder)){
      await fs.mkdirSync(monthFolder)  
    }  
  
    let dayFolder = join(monthFolder, new Date().getDay().toString())
    if (!fs.existsSync(dayFolder)){
      await fs.mkdirSync(dayFolder)  
    }  

    let uploadDirFinal = join(dayFolder, stringHelper.random(10))
    if (!fs.existsSync(uploadDirFinal)){
      await fs.mkdirSync(uploadDirFinal)  
    }  
  
    await cb(null, uploadDirFinal)
  },
  filename: (req, file, cb) => {
    console.log(file.originalname)
    cb(null, file.originalname)
  },
})

let uploadFileMulter = multer({
  storage: storage,
  limits: { 
    fileSize: maxSize 
  },
  fileFilter: (_req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null,true)
    } else {
      cb(new Error('Filetype not allowed'))
    }    
  }  
}).single("file")

let uploadFile = util.promisify(uploadFileMulter)

/**
 * Remove EXIF metadata
 *
 * @param   object  file  Object of uploaded image
 *
 * @return  mixed
 */
let removeExifMetadata = async (file) => {
  if (!file.path) {
    return
  }
  const imageToBeCleaned = await fs.readFileSync(file.path)
  let image = await exifremove.remove(imageToBeCleaned)
  await fs.writeFileSync(file.path, image, 'binary')
}

export default { uploadFile, removeExifMetadata }