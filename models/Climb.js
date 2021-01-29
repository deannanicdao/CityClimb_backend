import mongoose from 'mongoose'
import { User } from './User'

const ClimbSchema = new mongoose.Schema({
    gym: {
        type: String,
        enum: ['milton', 'newstead', 'west end'],
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
    setBy: {
        type: User,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    removalDate: {
        type: Date,
        required: false 
    },
    image: {
        Data: Buffer,
        ContentType: String, 
    },
    video: {
        type: String
    }
})

export default mongoose.model('Climb', ClimbSchema)