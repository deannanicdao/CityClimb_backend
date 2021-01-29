
import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        require: true
    }
})

// const ProductModel = mongoose.model("products", ProductSchema)
// module.exports = ProductModel

// module.exports = Product = mongoose.model('product', ProductSchema)
// takes in model name and schema name
export default mongoose.model('Product', ProductSchema)