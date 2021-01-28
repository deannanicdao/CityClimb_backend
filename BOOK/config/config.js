const config = {
    env: process.env.NODE_ENV || 'start',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
    mongoUri: process.env.MONGODB_URI || process.env.MONGO_HOST || 'mongodb+srv://Admin:<sAeyi6TUGkDMUUWm>@cityclimb.8vbtl.mongodb.net/<MERN_T3A2>?retryWrites=true&w=majority' + (process.env.IP || 'localhost') + ':' + (process.env.MONGO_PORT || '27017') + '/mernproject'
}

export default config