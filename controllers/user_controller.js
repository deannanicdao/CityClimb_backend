import express from 'express'
import User from '../models/User.js'
import { validationResult } from 'express-validator'
import DatauriParser from 'datauri/parser.js'
import path from 'path'
import { uploader } from '../config/cloudinaryConfig.js'
const router = express.Router(); // TODO: get rid of this after refactoring other routes


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

        if (user) {
            response.status(400).json({ errors: [ { msg: 'user already exists' }] })
        }
        uploader.upload(file,(url, err) => {
            const image = url.url
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
        .then(confirmation => response.send(console.log(confirmation)))
        // TODO: Returns the deleted object - change this to return status
		.catch(error => response.send(error))
})


export default {
    create
}