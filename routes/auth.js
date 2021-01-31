const { request, response } = require('express')
const express = require('express')
const router = express.Router()
const auth = require('./../middleware/auth')


// @route   GET auth
// @desc    Test route
// @access  Public
router.get("/", auth, (request, response) => response.send('Auth route'))

module.exports = router