// const mongoose = require("mongoose")
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    staffNumber: {
        type: String,
        required: true
        // unique: true
    },
    email: {
        type: String,
        required: true
        // unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        trim: true,
        required: false
    }
}, { timestamps: true })


const User = mongoose.model('User', UserSchema)

export default User