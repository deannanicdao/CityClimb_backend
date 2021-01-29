const express = require("express")
const router = express.Router()
const Product = require("../models/Product.js")
const { check, validationResult } = require('express-validator')

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

// UPDATE
// router.put("/:id", [
//     check('name', 'Name is required').not().isEmpty(),
//     check('description', 'Description is required').not().isEmpty(),
//     check('price', 'Please enter a price to three values (0.00)').isLength({ min: 3 })
// ], async (request, response) => 
//     {
//         let errors = validationResult(request)
//         if (!errors.isEmpty()) {
//             return response.status(400).json({ errors: errors.array() })
//         }

//         const { name, description, price } = request.body

//         try {
//             let product = await Product.findById(request.params.id)
//                 if (product) {
//                     response.send(product)
//                     let newProduct = request.body
//                     product.splice(index)
//                 }
//             } catch (err) {
//                 console.error(err.message)
//                 response.status(500).send('Server error')
//             }

//             let indexOfTheElement = await products.findIndex({ name })

//             if (product) {
//                 response.status(400).json({ errors: [ { msg: 'Product already exists' }] })
//             }

//             product = new Product({
//                 name,
//                 description,
//                 price
//             })

//             await product.save()

//             response.status(201).send(product)
//         } catch (err) {
//             console.error(err.message)
//             response.status(500).send('Server error')
//         }

//         let indexOfTheElement = products.findIndex(element => element.id == request.params.id)
//         let newProduct = request.body
//         products.splice(indexOfTheElement, 1, newProduct)
//         response.send(products[indexOfTheElement])
// })

// router.patch("/:id", (request, response) => {
//     let product = products.find(el => el.id == request.params.id)
    
//     Object.keys(request.body).forEach(key => {
//         if (product.key) {
//             product.key == request.body[key]
//         }
//     })

//     if (request.body.name) {
//         product.name = request.body.name
//     }
//     if (request.body.description) {
//         product.description = request.body.description
//     }
//     if (request.body.price) {
//         product.price = request.body.price
//     }
    
//     response.send(product)
// })

// DELETE
router.delete("/:id", (request, response) => {
    // let index = products.findByIdAndDelete(el => el.id == request.params.id)
    // if (index != -1) {
    //     products.splice(index, 1)
    //     response.sendStatus(200)
    // } else {
    //     response.sendStatus(404)
    // }
    Product.findByIdAndDelete(request.params.id)
        .then(confirmation => response.send(console.log(confirmation)))
		.catch(error => response.send(error))
})

module.exports = router