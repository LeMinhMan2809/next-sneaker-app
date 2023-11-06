import { Product } from "@/models/Product"
import mongooseConnect from "@/lib/mongoose"

export default async function handle (req, res){
    const { method } = req
    await mongooseConnect()

    await isAdminRequest(req, res)

    if (method === 'GET'){
        //check if id exists
        if (req.query?.id) {
            res.json (await Product.findOne({_id:req.query.id}))  
        }else {
            res.json (await Product.find())
        }
    }


    if (method === 'POST'){
        const {brand, title, description, images, category} = req.body
        const productDoc = await Product.create({
            brand, title, description, images, category,
        })
        res.json (productDoc)
    }

    if (method === 'PUT'){
        const {brand, title, description,images,category,_id} = req.body
        await Product.updateOne({_id}, {brand, title, description,images,category})
        res.json(true)
    }

    if (method === 'DELETE'){
        if (req.query?.id) {
            await Product.deleteOne({_id:req.query?.id})
            res.json (true)
        }
    }

}