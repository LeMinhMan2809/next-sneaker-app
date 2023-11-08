import { Product } from "@/models/Product"
import mongooseConnect from "@/lib/mongoose"
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req
    await mongooseConnect()

    // await isAdminRequest(req, res)

    if (method === 'GET') {
        if (req.query?.id) {
            if (req.query.id.match(/^[0-9a-fA-F]{24}$/)) {
                res.json(await Product.findOne({ _id: req.query.id }));
            }
            else {
                res.json(null);
            }
        } else {
            res.json(await Product.find());
        }
    }


    if (method === 'POST') {
        const { brand, title, description, images, category } = req.body
        const productDoc = await Product.create({
            brand, title, description, images, category,
        })
        res.json(productDoc)
    }

    if (method === 'PUT') {
        const { brand, title, description, images, category, _id } = req.body
        await Product.updateOne({ _id }, { brand, title, description, images, category })
        res.json(true)
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            await Product.deleteOne({ _id: req.query?.id })
            res.json(true)
        }
    }

}