import mongoose from 'mongoose'

const ClimbSchema = new mongoose.Schema({
    gym: {
        type: String,
        enum: ['milton', 'newstead', 'westend'],
        required: true
    },
    title: {
        type: String,
        required: true,
        maxLength: 24,
        trim: true
    },
    colour: {
        type: String,
        enum: ['black', 'blue', 'green', 'orange', 'purple', 'red', 'white', 'yellow'],
        required: true
    },
    removalDate: {
        type: Date,
        expires: 10,
    },
    image: {
        type: String,
        trim: true,
        required: true
    },
    video: {
        type: String,
        trim: true,
        required: true
    }
}, { timestamps: true})


const Climb = mongoose.model('Climb', ClimbSchema)

export default Climb