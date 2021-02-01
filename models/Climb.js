// const mongoose = require("mongoose")
// const User = require("./User")

import mongoose from 'mongoose'

const ClimbSchema = new mongoose.Schema({
    gym: {
        type: String,
        enum: ['Milton', 'Newstead', 'West End'],
        required: true
    },
    wall: {
        type: String,
        required: true
    },
    colour: {
        type: String,
        enum: ['black', 'blue', 'green', 'orange', 'purple', 'red', 'white', 'yellow'],
        required: true
    },
    setter: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    removalDate: {
        type: Date,
        required: false 
    },
    image: {
        type: String,
        trim: true,
        required: false
    },
    video: {
        type: String,
        trim: true,
        required: true
    }
}, { timestamps: true})


// module.exports = Climb = mongoose.model('Climb', ClimbSchema)

const Climb = mongoose.model('Climb', ClimbSchema)

export default Climb