import express from 'express'
import multer from 'multer'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'
import pa11y from 'pa11y'

// Utilities:
const LOG     = console.log
const TABLE   = console.table
const ERROR   = console.error

const SERVER  = express()
const PORT    = process.env.PORT || 3000
const DIRNAME = path.dirname(fileURLToPath(import.meta.url))
const STORAGE = multer.diskStorage({
  destination : (Request, File, Callback) => {
    Callback(null, path.join(DIRNAME, 'uploads'))
  },
  filename : (Request, File, Callback) => {
    Callback(null, Date.now() + '_' + File.originalname)
  }
})
const UPLOAD = multer({ storage : STORAGE })

SERVER.use(express.static(path.join(DIRNAME, 'view/assets')))

// GET:
SERVER.get('/', (Request, Response) => {
  LOG(`Request : ${Request.method}`)
  Response.sendFile(path.join(DIRNAME, 'view/index.html'))
})

// POST:
SERVER.post('/upload', UPLOAD.single('file'), async (Request, Response) => {

  if (Request.file) {
    const A11Y_ERRORS = await checkA11y(Request.file.path)

    if (A11Y_ERRORS.issues.length > 0) {
      Response.json(A11Y_ERRORS)
      deleteFileAfter5Seonds(Request.file.path)
    } else {
      Response.json({ message : 'No accessiblity errors found as per WCAG 2.1, WCAG 2.2.' })   
    }
  } else {
    Response.json({ message : 'Document upload failed.' })
  }
})

// LISTEN:
SERVER.listen(PORT, () => console.log(`SERVER listening on <http://localhost:${PORT}>`))

// Pa11y:
async function checkA11y(Filepath) {
 return await pa11y(Filepath)
}

function deleteFileAfter5Seonds(Filepath) {
  setTimeout(async () => {
    try {
      await fs.unlink(Filepath)
      LOG('File deleted successfully.')
    } catch(Err) {
      ERROR('Error deleting file : ', Err)
    }  
  }, 5000)
}

