import mongooseConnect from "@/lib/mongoose";
import Inventory from "@/models/Inventory";
import Product from "@/models/Product";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === "GET") {
        if (req.query?.productIDs) {
            res.json(await Inventory.findOne({ product: req.query.productIDs }));
        }
        else {
            res.json(await Inventory.find().populate("product"));
        }
    }

    if (method === "POST") {
        const { productIDs, total, sizes, price } = req.body;
        const inventoryDoc = await Inventory.create({
            product: productIDs,
            totalQuantity: total,
            size: sizes,
            price: price,
        });
        res.json(inventoryDoc);
    }

    if (method === "PUT") {
        const { _id, productIDs, total, sizes, price } = req.body;
        await Inventory.updateOne({ _id: _id }, {
            product: productIDs,
            totalQuantity: total,
            size: sizes,
            price: price,
        });
        res.json(true);
    }

    if (method === "DELETE") {
        if (req.query?._id) {
            // await WishedProduct.deleteMany({ inventory: req.query._id });
            await Inventory.deleteOne({ _id: req.query._id });
            res.json("ok");
        }
        else if (req.query?.productId) {
            const inventoryId = await Inventory.findOne({ product: req.query.productId });
            // await WishedProduct.deleteMany({ inventory: inventoryId._id });
            await Inventory.deleteOne({ product: req.query.productId });
            res.json("ok");
        }
    }
}