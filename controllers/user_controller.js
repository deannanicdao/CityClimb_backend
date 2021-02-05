import express from 'express'
import User from '../models/User.js'
import { validationResult } from 'express-validator'
import DatauriParser from 'datauri/parser.js'
import path from 'path'
import { uploader } from '../config/cloudinaryConfig.js'
const router = express.Router(); // TODO: get rid of this after refactoring other routes


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
        
        const { name, email, staffNumber, password } = request.body
        const parser = new DatauriParser()
        const fileExtension = path.extname(request.file.originalname).toString().toLowerCase()
        const bufferContent = request.file.buffer
        const file = parser.format(fileExtension, bufferContent).content
        let user = await User.findOne({ name })

        //TODO: merge validation_staffNumber_email branch into main
        if (user) {
            response.status(400).json({ errors: [ { msg: 'user already exists' }] })
        }
        uploader.upload(file,(uploadResponse, err) => {
            const image = uploadResponse.url
            user = new User({
                name,
                email,
                staffNumber,
                password,
                image
            })

            console.log(image)

            user.save((err, climb) => {
                if (err) {
                    console.error(err.message)
                    response.status(500).send('Server error')
                }
                response.status(201).json({
                    message: "User successfully registered",
                    user
                })
            })
    })
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