
import express from 'express'
import userCtrl from '../controllers/user_controller.js'
import { check, validationResult } from 'express-validator'

// use multer and dataUri from upload
import upload from '../middleware/upload.js'

// JWT auth middleware
import auth from '../middleware/auth.js'

const router = express.Router()

// const express = require('express');
// const router = express.Router();
// import userCtrl from '../controllers/user_controller.js'
// const bcrypt = require('bcryptjs');
// const auth = require('../middleware/auth');
// const jwt = require('jsonwebtoken');
// const config = require('config');
// const { check, validationResult } = require('express-validator');


// const User = require('../models/User');

// Register a user
router.route('/register').post(upload, userCtrl.createUser, [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('staffNumber', 'Please enter a valid staff number').isLength({ min: 6 }),
    check('password', 'Please enter a valid password with 6 or more characters').isLength({ min: 6 })
])

// Login a user
router.route('/login').post(upload, userCtrl.loginUser, [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a valid password').isLength({ min: 6 })
])

// User token
router.route('/').post(upload, userCtrl.loginUser, [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a valid password').isLength({ min: 6 })
])

export default router


// // @route    GET api/auth
// // @desc     Get user by token
// // @access   Private
// router.get('/', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     res.json(user);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // @route    POST api/auth
// // @desc     Authenticate user & get token
// // @access   Public
// router.post(
//   '/users',
//   check('email', 'Please include a valid email').isEmail(),
//   check('password', 'Password is required').exists(),
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;

//     try {
//       let user = await User.findOne({ email });

//       if (!user) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'Invalid Credentials' }] });
//       }

//       const isMatch = await bcrypt.compare(password, user.password);

//       if (!isMatch) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'Invalid Credentials' }] });
//       }

//       const payload = {
//         user: {
//           id: user.id
//         }
//       };

//       jwt.sign(
//         payload,
//         config.get('jwtSecret'),
//         { expiresIn: '5 days' },
//         (err, token) => {
//           if (err) throw err;
//           res.json({ token });
//         }
//       );
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// );

// module.exports = router;
