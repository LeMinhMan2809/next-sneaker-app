const { Schema, default: mongoose } = require("mongoose");

const InventorySchema = new Schema({
    product: { type: mongoose.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 0 },
    price: { type: Number, default: 0 }
}, {
    timestamps: true,
})

export default mongoose.models.Inventory || mongoose.model("Inventory", InventorySchema); 