const { model, Schema, models } = require("mongoose");

const ProductSchema = new Schema({
    brand: {type:String, required: true},
    title: {type:String, required: true},
    description: String,
    images: [{type: String}],
})

export const Product = models.Product || model('Product', ProductSchema);