import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/router";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({ _id, brand: existingBrand, title: existingTitle, description: existingDescription, images: existingImages }) {

    const [brand, setBrand] = useState(existingBrand || '')
    const [title, setTitle] = useState(existingTitle || '')
    const [description, setDescription] = useState(existingDescription || '')
    const [images, setImages] = useState(existingImages || [])

    const [goToProducts, setGoToProducts] = useState(false)
    const router = useRouter()
    async function saveProduct(e) {
        e.preventDefault()
        const data = { brand, title, description }

        if (_id) {
            //Update
            await axios.put('/api/products/', { ...data, _id })
        } else {
            //Create
            const data = { brand, title, description }
            await axios.post('/api/products', data)

        }
        setGoToProducts(true)
    }

    if (goToProducts) {
        router.push('/products')
    }

    async function uploadImages(e) {
        const files = e.target?.files
        if (files?.length > 0) {
            const data = new FormData()
            for (const file of files) {
                data.append('file', file)
            }
            const res = await axios.post('/api/upload', data)
            setImages(oldImages => {
                return [...oldImages, ...res.data.links]
            })
        }
    }

    function updateImagesOrder(images) {
        setImages(images)
    }

    return (
        <form onSubmit={saveProduct} action="" method="POST">

            <label>Product brand</label>
            <input type="text" placeholder="Product brand" value={brand} onChange={e => setBrand(e.target.value)} />

            <label>Product name</label>
            <input type="text" placeholder="Product name" value={title} onChange={e => setTitle(e.target.value)} />

            <label>Product description</label>
            <input type="text" placeholder="Product description" value={description} onChange={e => setDescription(e.target.value)} />

            <label className="pb-2">Photos</label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable list={images} className="flex flex-warp gap-1" setList={updateImagesOrder}>
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-24 bg-white p-2 rounded-sm border border-gray-200 shadow-sm">
                            <img className="max-h-full rounded-full" src={link} />
                        </div>
                    ))}
                </ReactSortable>
                <label className="w-24 h-24 text-center flex items-center justify-center gap-1 text-sm text-gray-900 rounded-sm bg-white shadow-sm border border-gray-200 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Upload
                    </div>
                    <input type="file" onChange={uploadImages} className="hidden"></input>
                </label>
            </div>


            <button type="submit" className="btn-primary">Save</button>
        </form>
    )
}