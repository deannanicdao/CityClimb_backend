import express from 'express'
import userCtrl from '../controllers/user_controller.js'
import { check, validationResult } from 'express-validator'

// use multer and dataUri from upload
import upload from '../middleware/upload.js'

// JWT auth middleware
import auth from '../middleware/auth.js'

const router = express.Router()

// Login a user
router.route('/').post(upload, userCtrl.loginUser, [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a valid password').isLength({ min: 6 })
])

// Admin routes - PRIVATE
// Register a user
router.route('/').post(auth, upload, userCtrl.createUser, [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('staffNumber', 'Please enter a valid staff number').isLength({ min: 6 }),
    check('password', 'Please enter a valid password with 6 or more characters').isLength({ min: 6 })
])
// GET all users
router.route('/').get(auth, userCtrl.listUsers)

// GET a single user
router.route('/:id').get(auth, userCtrl.listUser)

// UPDATE an entire user
router.route('/:id').put(auth, userCtrl.updateUser)

// EDIT a user field
router.route('/:id').patch(auth, userCtrl.editUser)

// DELETE a user
router.route('/:id').delete(auth, userCtrl.deleteUser)

export default router
