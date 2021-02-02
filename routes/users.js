import express from 'express'
import userCtrl from '../controllers/user_controller.js'
import { check } from 'express-validator'

// use multer and dataUri from upload
import upload from '../middleware/upload.js'

const router = express.Router()

router.route('/').post(upload, userCtrl.create, [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('staffNumber', 'Please enter a valid staff number').isLength({ min: 6 }),
    check('password', 'Please enter a valid password with 6 or more characters').isLength({ min: 6 })
])


export default router
