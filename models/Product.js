import mongoose, { model, Schema, models} from "mongoose"

const ProductSchema = new Schema({
    brand: {type:String, required: true},
    title: {type:String, required: true},
    description: String,
    images: [{type: String}],
    category: {type:mongoose.Types.ObjectId, ref:'Category'},
})

export const Product = models.Product || model('Product', ProductSchema);