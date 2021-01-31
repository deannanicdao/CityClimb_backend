import express from 'express'
import climbCtrl from '../controllers/climb.controller.js'

// use multer 
import uploadMulter from '../middleware/upload.js'

// import multer from 'multer'
// const upload = multer({ dest: 'uploads/' })

const router = express.Router()

router.route('/').post(uploadMulter, climbCtrl.create)



export default router

