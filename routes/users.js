const express = require('express');
const router = express.Router();
const User = require('./../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const { check, validationResult } = require('express-validator');
// const normalize = require('normalize-url');

// GET
// Find all users
router.get("/", async (request, response) => {
    try {
        let users = await User.find()
        if (users) {
            response.send(users)
        }
    } catch (err) {
        console.error(err.message)
        response.status(500).send('Server error')
    }
    
})

// GET
// Find user by id
router.get("/:id", async (request, response) => {
    try {
        let user = await User.findById(request.params.id)
        if (user) {
            response.send(user)
        } else {
            response.send('User not found.')
        }
    } catch (err) {
        console.error(err.message)
        response.status(500).send('Server error')
    }
   
})

// REGISTER
// Register a new user
router.post("/", [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('staffNumber', 'Please enter a valid staff number').isLength({ min: 6 }),
    check('password', 'Please enter a valid password with 6 or more characters').isLength({ min: 6 })
], async (request, response) => 
    {
        let errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() })
        }
        
        const { name, email, staffNumber, password } = request.body

        try {
            let user = await User.findOne({ name })

            if (user) {
                return response.status(400).json({ errors: [ { msg: 'User already exists' }] })
            }

            let avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            // Higher genSalt the more secure, but compromises speed
            let salt = await bcrypt.genSalt(10) 

            
            user = new User({
                name,
                email,
                staffNumber,
                password,
                avatar
            })
            
            // Hash password
            user.password = await bcrypt.hash(password, salt)

            await user.save()
            
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

            // response.send('User registered')

            // response.status(201).send(user)
        } catch (err) {
            console.error(err.message)
            response.status(500).send('Server error')
        }
    }
)

// UPDATE
// Update an entire user
router.put("/:id", (request, response) => {
    User.findOneAndReplace({ _id: request.params.id }, request.body)
    .then(document => response.send(document))
    .catch(error => response.send(error))
})

// Update existing fields of user
router.patch("/:id", (request, response) => {
    User.findByIdAndUpdate(request.params.id, request.body)
        .then(document => response.send(document))
        .catch(error => response.send(error))
})

// DELETE
// Remove a user
router.delete("/:id", (request, response) => {
    User.findByIdAndDelete(request.params.id)
        .then(response.send('User deleted'))
        // TODO: Returns the deleted object - change this to return status
		.catch(error => response.send(error))
})

module.exports = router;