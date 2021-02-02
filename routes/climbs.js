import express from 'express'
import climbCtrl from '../controllers/climb_controller.js'
import imageUploadValidation from '../middleware/imageUploadValidation.js'

// use multer from upload
import upload from '../middleware/upload.js'

const router = express.Router()


router.route('/').get(climbCtrl.listClimbs).post(upload, imageUploadValidation, climbCtrl.create)

router.route('/:gym/').get(climbCtrl.listClimbs)

router.route('/:gym/:colour').get(climbCtrl.listClimbs)

router.route('/:gym/:colour/:climbId').get(climbCtrl.readClimb).patch(climbCtrl.addRemovalDate)

export default router

