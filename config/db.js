import mongoose from 'mongoose'
import dotenv from 'dotenv'

import config from 'config'

dotenv.config()
const db = config.get('mongoURI')

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log('MongoDB connected')
    } catch (err) {
        console.error(err.message)
        // Exit process with failure
        process.exit(1)
    }
}

export default connectDB
