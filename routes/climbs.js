import express from 'express'
import climbCtrl from '../controllers/climb_controller.js'

// use multer 
import uploadMulter from '../middleware/upload.js'

const router = express.Router()

router.route('/').post(uploadMulter, climbCtrl.create)


export default router

