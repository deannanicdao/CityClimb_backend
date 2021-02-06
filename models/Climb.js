// const mongoose = require("mongoose")
// const User = require("./User")

import mongoose from 'mongoose'

const ClimbSchema = new mongoose.Schema({
    gym: {
        type: String,
        enum: ['milton', 'newstead', 'westend'],
        required: false
    },
    wall: {
        type: String,
        required: false
    },
    colour: {
        type: String,
        enum: ['black', 'blue', 'green', 'orange', 'purple', 'red', 'white', 'yellow'],
        required: false
    },
    setter: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    removalDate: {
        type: Date,
        expires: 10,
    },
    image: {
        type: String,
        trim: true,
        required: false
    },
    video: {
        type: String,
        trim: true,
        required: false
    }
}, { timestamps: true})


// module.exports = Climb = mongoose.model('Climb', ClimbSchema)

const Climb = mongoose.model('Climb', ClimbSchema)

export default Climb