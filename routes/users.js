import express from 'express'
import userCtrl from '../controllers/user_controller.js'
import { check, validationResult } from 'express-validator'

// use multer and dataUri from upload
import upload from '../middleware/upload.js'

// JWT auth middleware
import auth from '../middleware/auth.js'

const router = express.Router()

router.route('/').post(auth, upload, userCtrl.create, [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('staffNumber', 'Please enter a valid staff number').isLength({ min: 6 }),
    check('password', 'Please enter a valid password with 6 or more characters').isLength({ min: 6 })
])

// Admin routes
router.route('/').get(auth, userCtrl.listUsers)
router.route('/:id').get(auth, userCtrl.listUser)
router.route('/:id').put(auth, userCtrl.updateUser)
router.route('/:id').patch(auth, userCtrl.editUser)
router.route('/:id').delete(auth, userCtrl.deleteUser)

export default router
