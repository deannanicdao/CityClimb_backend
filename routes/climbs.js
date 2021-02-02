import express from 'express'
import climbCtrl from '../controllers/climb_controller.js'

// use multer and dataUri from upload
import upload from '../middleware/upload.js'

const router = express.Router()

router.route('/').post(upload, climbCtrl.create)


export default router

