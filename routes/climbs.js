import express from 'express'
import climbCtrl from '../controllers/climb.controller.js'

// use multer 
import uploadMulter from '../middleware/upload.js'

const router = express.Router()

router.route('/climb').post(uploadMulter, climbCtrl.create)



export default router

