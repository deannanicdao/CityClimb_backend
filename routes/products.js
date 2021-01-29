const express = require("express")
const router = express.Router()
const Product = require("../models/Product.js")
const { check, validationResult } = require('express-validator')
// const { Router, response } = require("express")

// GET
// Find all products
router.get("/", async (request, response) => {
    try {
        let products = await Product.find()
        if (products) {
            response.send(products)
        }
    } catch (err) {
        console.error(err.message)
        response.status(500).send('Server error')
    }
    
})

// GET
// Find by id
router.get("/:id", async (request, response) => {
    try {
        let product = await Product.findById(request.params.id)
        if (product) {
            response.send(product)
        }
    } catch (err) {
        console.error(err.message)
        response.status(500).send('Server error')
    }
   
})


// CREATE
// A single product
router.post("/", [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('price', 'Please enter a price to three values (0.00)').isLength({ min: 3 })
], async (request, response) => 
    {
        let errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() })
        }
        
        const { name, description, price } = request.body

        try {
            let product = await Product.findOne({ name })

            if (product) {
                response.status(400).json({ errors: [ { msg: 'Product already exists' }] })
            }

            product = new Product({
                name,
                description,
                price
            })

            await product.save()

            response.status(201).send(product)
        } catch (err) {
            console.error(err.message)
            response.status(500).send('Server error')
        }
    }
)

// POST
// Search by match
// router.post("/search", (request, response) => {
//     Product.where('name', request.body.keyword)
//         .then(document => response.send(document))
//         .catch(error => response.send(error))
// })


// UPDATE
// Replace
router.put("/:id", (request, response) => {
    Product.findOneAndReplace({ _id: request.params.id }, request.body)
    .then(document => response.send(document))
    .catch(error => response.send(error))
})

// Update existing fields
router.patch("/:id", (request, response) => {
    Product.findByIdAndUpdate(request.params.id, request.body)
        .then(document => response.send(document))
        .catch(error => response.send(error))
})

// DELETE
router.delete("/:id", (request, response) => {
    Product.findByIdAndDelete(request.params.id)
        .then(confirmation => response.send(console.log(confirmation)))
        // TODO: Returns the deleted object - change this to return status
		.catch(error => response.send(error))
})

module.exports = router