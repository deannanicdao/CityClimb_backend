import express from 'express'
import { create, listClimbs, addRemovalDate, editClimb, removeClimb } from '../controllers/climb_controller.js'
// import climbCtrl from '../controllers/climb_controller.js'
import imageUploadValidation from '../middleware/imageUploadValidation.js'

// use multer from upload
import upload from '../middleware/upload.js'

const router = express.Router()


router.route('/').get(listClimbs).post(upload, imageUploadValidation, create)
router.route('/:gym/').get(listClimbs)

// router.route('/:climbId/').get(readClimb)


router.route('/:gym/:colour').get(listClimbs)

router.route('/:gym/:colour/:climbId').get(listClimbs).patch(addRemovalDate)

router.route('/:gym/:colour/:climbId/edit').patch(upload, imageUploadValidation, editClimb).delete(removeClimb)

export default router

//