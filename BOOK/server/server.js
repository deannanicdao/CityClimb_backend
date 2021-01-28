import config from './../config/config'
import app from './express'
import mongoose from 'mongoose'


app.listen(config.port, (err) => {
    if (err) {
        console.log(err)
    }
    console.info('Server started on port %s.', config.port)
})

mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, { 
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true
})

mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${mongoUri}`)
})
// .then(() => app.listen(config.port, () => console.info('Server Running on port %s', config.port)))
// // if connection fails...
// .catch((error) => console.log(`${error} did not connect`));

// // Passes param on set to prevent console warnings
// mongoose.set('useFindAndModify', false);
