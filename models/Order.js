const { Schema, models, model } = require("mongoose");

const OrderSchema = new Schema({
    line_items: Object,
    name: String,
    email: String,
    phone: String,
    address: String,
    shippingFee: Number,
    paid: Boolean,
}, {
    timestamps: true
})

export const Order = models?.Order || model('Order', OrderSchema);