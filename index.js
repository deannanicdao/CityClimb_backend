// const express = require("express")
// const { indexOf } = require("methods")
// const connectDB = require('./config/db')

import express from 'express'
import { indexOf } from 'methods'
import connectDB from './config/db' 

let app = express()

// Connect database
connectDB()

// mongoose.connect(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log("Connected to the database"))
// .catch(() => console.log("There was an error connecting to the database"))

// Middleware
app.use(express.json())
app.use("/products", require("./routes/products.js"))
app.use("/users", require("./routes/users.js"))
// app.use(express.urlencoded())

// GET "/"
// path, callback
app.get("/", (request, response) => {
    console.log("Root path - GET request")
    console.log(request)
    response.send("Welcome to my first web server")
})

app.listen(3000, () => {
    console.log("listening to the server")
})