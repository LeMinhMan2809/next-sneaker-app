import Category from "@/models/Category";
import { Product } from "@/models/Product"
import mongooseConnect from "@/lib/mongoose"
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req
    await mongooseConnect()

    if (method === 'GET') {
        if (req.query?.id) {
            if (req.query.id.match(/^[0-9a-fA-F]{24}$/)) {
                res.json(await Product.findOne({ _id: req.query.id }));
            }
            else {
                res.json(null);
            }
        } else {
            res.json(await Product.find().populate('category'));
        }
    }


    if (method === 'POST') {
        const { title, description, images, category } = req.body
        const productDoc = await Product.create({
            title, description, images, category,
        })
        res.json(productDoc)
    }

    if (method === 'PUT') {
        const { title, description, images, category, _id } = req.body
        await Product.updateOne({ _id }, { title, description, images, category })
        res.json(true)
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            await Product.deleteOne({ _id: req.query?.id })
            res.json(true)
        }
    }

}