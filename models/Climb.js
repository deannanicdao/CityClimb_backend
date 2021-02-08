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


const Climb = mongoose.model('Climb', ClimbSchema)

export default Climb