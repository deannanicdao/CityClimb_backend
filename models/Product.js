const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

// const ProductModel = mongoose.model("products", ProductSchema)
// module.exports = ProductModel

module.exports = Product = mongoose.model('product', ProductSchema)
// takes in model name and schema name