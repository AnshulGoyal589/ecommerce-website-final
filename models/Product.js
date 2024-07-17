const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    owner: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    text: String
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    img: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    review: [reviewSchema],
    status: {
        type: String,
        default: 'Available'
    },
    quantity: {
        type: Number,
        default: 1,
        min: 0
    }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;