import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/router";

export default function ProductForm ({_id, brand: existingBrand, title: existingTitle, description:existingDescription,images}) {

    const [brand, setBrand] = useState(existingBrand || '')
    const [title, setTitle] = useState(existingTitle || '')
    const [description, setDescription] = useState(existingDescription || '')
    
    const [goToProducts, setGoToProducts] = useState(false)
    const router = useRouter() 
    async function saveProduct (e){
        e.preventDefault()
        const data = {brand, title, description}

        if (_id){
            //Update
            await axios.put ('/api/products/', {...data,_id})
        } else {
            //Create
            const data = {brand, title, description}
            await axios.post('/api/products', data)
            
        }
        setGoToProducts(true)
    }

    if (goToProducts){
        router.push('/products')
    }

    async function uploadImages(e){
        const files = e.target?.files
        if (files?.length > 0){
            const data = new FormData()
            for (const file of files){
                data.append('file', file)
            }
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data
            })
            console.log(res.data)
        }
    }

    return (
        <form onSubmit={saveProduct} action="" method="POST">

            <label>Product brand</label>
            <input type="text" placeholder="Product brand" value={brand} onChange={e => setBrand(e.target.value)}/>

            <label>Product name</label>
            <input type="text" placeholder="Product name" value={title} onChange={e => setTitle(e.target.value)}/>

            <label>Product description</label>
            <input type="text" placeholder="Product description" value={description} onChange={e => setDescription(e.target.value)}/>

            <label className="pb-2">Photos</label>
            <div className="mt-2">
                <label className="w-24 h-24 cursor-pointer text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-md bg-gray-200 ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                            </svg>
                            
                            <div>Upload</div>
                            <input type="file" onChange={uploadImages} className="hidden" />
                </label>
            

                {!images?.length && (<div>No images</div>)}
            
            </div>


            <button type="submit" className="btn-primary">Save</button>
        </form>
    )
}