import express from 'express'
import User from '../models/User.js'
import config from 'config'
import { validationResult } from 'express-validator'
import DatauriParser from 'datauri/parser.js'
import path from 'path'
import { uploader } from '../config/cloudinaryConfig.js'
import bcrypt from 'bcryptjs'
import gravatar from 'gravatar'
import jwt from 'jsonwebtoken'



// GET
// Find all users
const listUsers = async (request, response) => {
    try {
        let users = await User.find()
        if (users) {
            response.send(users)
        }
    } catch (err) {
        console.error(err.message)
        response.status(500).send('Server error')
    }
}

// GET
// Find user by id
const listUser = async (request, response) => {
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
   
}

// REGISTER
// Register a new user
const create = async (request, response) => 
    {
        let errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() })
        }
        
        // Deconstruct params from request body for validation
        const { name, email, staffNumber, password } = request.body

        // Creating a image file with new user
        const parser = new DatauriParser()
        const fileExtension = path.extname(request.file.originalname).toString().toLowerCase()
        const bufferContent = request.file.buffer
        const file = parser.format(fileExtension, bufferContent).content

        // Check if user exists by email or staff number, otherwise keep the current user
        let user = await User.findOne({ email })
        user = await User.findOne({ staffNumber }) || user

        // If user matches an existing user, the user object is no longer null and will hit the 400 status condition
        if (user) {
            response.status(400).json({ errors: [ { msg: 'User already exists' }] })
        } else {
            uploader.upload(file, async (uploadResponse, err) => {
                const image = uploadResponse.url
                user = new User({
                    name,
                    email,
                    staffNumber,
                    password,
                    image
                })
    
                // Set salt
                const salt = await bcrypt.genSalt(10)
                
                // Hash password
                user.password = await bcrypt.hash(password, salt)

                // Save user
                await user.save()

                // Load a payload with user id
                const payload = {
                    user: {
                        id: user.id
                    }
                }

                // Create JSON web token for auth
                jwt.sign(
                    payload, 
                    config.get('jwtSecret'),
                    { expiresIn: 360000 },
                    (err, token) => {
                        if (err) {
                            console.error(err.message)
                            response.status(500).send('Server error')
                        }
                        response.status(201).json({ token })
                        console.log("User registered")
                    }

                )
            })
        }
}

// UPDATE
// Update an entire user
const updateUser = (request, response) => {
    User.findOneAndReplace({ _id: request.params.id }, request.body, { new: true })
    .then(document => response.send(document))
    .catch(error => response.send(error))
}

// EDIT
// Update existing fields of user
const editUser = (request, response) => {
    User.findByIdAndUpdate(request.params.id, request.body, { new: true })
        .then(document => response.send(document))
        .catch(error => response.send(error))
}

// DELETE
// Remove a user
const deleteUser = (request, response) => {
    User.findByIdAndDelete(request.params.id)
        .then(confirmation => response.send(console.log(confirmation)))
        
        // TODO: Returns the deleted object - change this to return status
		.catch(error => response.send(error))
}


export default {
    create,
    listUsers,
    listUser,
    updateUser,
    editUser,
    deleteUser
}