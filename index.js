import express from 'express'
import connectDB from './config/db.js' 
import bodyParser from 'body-parser'
import cors from 'cors' // allows different domains
import productRoutes from './routes/products.js'
import climbRoutes from './routes/climbs.js'
import userRoutes from './routes/users.js'
import authRoutes from './routes/auth.js'
import {cloudinaryConfig } from './config/cloudinaryConfig.js'
import { listClimbs } from './controllers/climb_controller.js'
import path from 'path'

const app = express()
app.use(cors())

// Middleware
app.use(express.json())

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

// use uploads folder to save images
app.use('/uploads', express.static('uploads')) 
app.use('*', cloudinaryConfig)

// Connect database
connectDB()


app.use("/products", productRoutes)
app.use('/climbs', climbRoutes)
app.use("/users", userRoutes)
app.use("/auth", authRoutes)
// app.use('/auth', require('./routes/auth'))
// app.use('/users', require('./routes/users'));

// Get All the climbs 
app.use("/schedule", express.Router().get('/', listClimbs))



// GET "/"
// path, callback
app.get("/", (req, res) => {
    console.log("Root path - GET request")
    console.log(req)
    res.send("Landing page")
})

app.listen(8000, () => {
    console.log("listening to the server")
})

app.use((req, res) => {
    res.status(404).json({
        errors: "page not found"
    })
})