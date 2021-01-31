// const { request, response } = require('express')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth') 
const User = require('./../models/User')
const jwt = require('jsonwebtoken') 
const config = require('config')
const { check, validationResult } = require('express-validator')


// @route   GET auth
// @desc    Test route
// @access  Public
router.get("/", auth, async (request, response) => {
    try {
        const user = await User.findById(request.user.id).select('-password')
        response.json(user)
    } catch (err) {
        console.error(err.message)
        response.status(500).send('Server Error')
    }
})


// @route   POST auth
// @desc    Authenticate user & get token
// @access  Public
router.post("/", [
    check('email', 'Please include a valid email').isEmail(),
    check('staffNumber', 'Please enter a valid staff number').isLength({ min: 6 }),
    check('password', 'Please enter your password').exists()
], async (request, response) => 
    {
        let errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() })
        }
        
        const { email, staffNumber, password } = request.body

        try {
            let user = await User.findOne({ email, staffNumber })

            if (!user) {
                return response
                    .status(400)
                    .json({ errors: [ { msg: 'Invalid credentials' }] })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch) {
                return response
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid credentials' }] })
            }

            // TODO: Return jsonwebtoken with user ID for auth
            const payload = {
                user: {
                    id: user.id
                }
            }

            console.log(payload)

            // Sign JSON webtoken, pass in payload, secret, expiration, callback (error/token)
            // Token will be sent to headers, to access protected routes
            jwt.sign(
                payload, 
                config.get('jwtSecret'),
                { expiresIn: 360000 }, // TODO: set to 3600 seconds (1h) for production
                (err, token) => {
                    if (err) throw err;
                    response.json({ token }) // alternatively, can send user ID
                }
            )
        } catch (err) {
            console.error(err.message)
            response.status(500).send('Server error')
        }
    }
)

module.exports = router