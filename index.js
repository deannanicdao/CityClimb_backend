// const express = require("express")
// const { indexOf } = require("methods")
// const connectDB = require('./config/db')

import express from 'express'
import connectDB from './config/db.js' 
import bodyParser from 'body-parser'
import cors from 'cors' // allows different domains
import productRoutes from './routes/products.js'
import climbRoutes from './routes/climbs.js'
import userRoutes from './routes/users.js'

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

// Connect database
connectDB()

// mongoose.connect(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log("Connected to the database"))
// .catch(() => console.log("There was an error connecting to the database"))



// Input origin


app.use("/products", productRoutes)
app.use('/climbs', climbRoutes)
app.use("/users", userRoutes)




// GET "/"
// path, callback
app.get("/", (req, res) => {
    console.log("Root path - GET request")
    console.log(req)
    res.send("Welcome to my first web server")
})

app.listen(8000, () => {
    console.log("listening to the server")
})

app.use((req, res) => {
    res.status(404).json({
        errors: "page not found"
    })
})