const express = require("express")
const router = express.Router()
const ProductModel = require("../models/Product.js")
const { check, validationResult } = require('express-validator')


const products = [
    {
            id: 1,
            name: "item 1",
            description: "description 1", 
            price: 10
    },
    {
            id: 2,
            name: "item 2",
            description: "description 2", 
            price: 15
    },
    {
            id: 3,
            name: "item 3",
            description: "description 3", 
            price: 12.5
    }
]



router.get("/", (request, response) => {
    response.send(products)
})

router.get("/:id", (request, response) => {
    let product = products.find(el => el.id == request.params.id)
    response.send(product)
})


// CREATE
router.post("/", [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('price', 'Please enter a price to three values (0.00)').isLength({ min: 3 })
], async (request, response) => 
    {
        let errors = validationResult(request)
        if(!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() })
        }
        
        const { name, description, price } = request.body

        try {
            let product = await Product.findOne({ name })

            if(product) {
                response.status(400).json({ errors: [ { msg: 'Product already exists' }] })
            }

            product = new Product({
                name,
                description,
                price
            })

            await product.save()

            response.send('Product added.')
        } catch (err) {
            console.error(err.message)
            response.status(500).send('Server error')
        }


        // let product = request.body
        // // response.sendStatus(200)
        // console.log(product)
        // // products.push(product)

        // // Insert product into database
        // response.send(products)
    }
)

// UPDATE
router.put("/:id", (request, response) => {
    let indexOfTheElement = products.findIndex(element => element.id == request.params.id)
    let newProduct = request.body
    products.splice(indexOfTheElement, 1, newProduct)
    response.send(products[indexOfTheElement])
})

router.patch("/:id", (request, response) => {
    let product = products.find(el => el.id == request.params.id)
    
    Object.keys(request.body).forEach(key => {
        if (product.key) {
            product.key == request.body[key]
        }
    })

    if (request.body.name) {
        product.name = request.body.name
    }
    if (request.body.description) {
        product.description = request.body.description
    }
    if (request.body.price) {
        product.price = request.body.price
    }
    
    response.send(product)
})

// DELETE
router.delete("/:id", (request, response) => {
    let index = products.findIndex(el => el.id == request.params.id)
    if (index != -1) {
        products.splice(index, 1)
        response.sendStatus(200)
    } else {
        response.sendStatus(404)
    }
})

module.exports = router