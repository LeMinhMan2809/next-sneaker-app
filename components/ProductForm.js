import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import { useEffect } from "react";
export default function ProductForm({ _id, brand: existingBrand, title: existingTitle, description: existingDescription, images: existingImages, category: assignedCategory }) {

    const [brand, setBrand] = useState(existingBrand || '')
    const [title, setTitle] = useState(existingTitle || '')
    const [description, setDescription] = useState(existingDescription || '')
    const [images, setImages] = useState(existingImages || [])
    const [goToProducts, setGoToProducts] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [category, setCategory] = useState(assignedCategory ||'')
    const [categories, setCategories] = useState([])
    const router = useRouter()

    useEffect(() => {
       axios.get('/api/categories').then(result => {
           setCategories(result.data)
       }) 
    }, [])

    async function saveProduct(e) {
        e.preventDefault()
        const data = { brand, title, description, images, category }
        if (_id) {
            //Update
            await axios.put('/api/products/', { ...data, _id })
        } else {
            //Create
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
            setIsUploading(true)
            const data = new FormData()
            for (const file of files) {
                data.append('file', file)
            }
            const res = await axios.post('/api/upload', data)
            setImages(oldImages => {
                return [...oldImages, ...res.data.links]
            })
            setIsUploading(false)
        }
    }
    //Sort images
    function updateImagesOrder(images) {
        setImages(images)
    }
    return (
        <form onSubmit={saveProduct} action="" method="POST">

            <label>Product brand</label>
            <input type="text" placeholder="Product brand" value={brand} onChange={e => setBrand(e.target.value)} />

            <label>Product name</label>
            <input type="text" placeholder="Product name" value={title} onChange={e => setTitle(e.target.value)} />

            <label>Category</label>

            <select value={category} onChange={e => setCategory(e.target.value)}> 
                <option>Uncategorized</option>
                {categories.length > 0 && categories.map(c => (
                    <option value={c._id}>{c.name}</option>
                ))}
            </select>

            <label>Product description</label>
            <input type="text" placeholder="Product description" value={description} onChange={e => setDescription(e.target.value)} />

            <label className="pb-2">Photos</label>
            <div className="mt-2 flex flex-wrap gap-1">
                <ReactSortable list={images} setList={updateImagesOrder} className="flex flex-wrap gap-1">
                    {!!images?.length > 0 && images.map((link, index) => (
                        <div key={index} className="h-24 w-24 inline-block ">
                            <img src={link} alt="" className="max-h-full" />
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-23 flex items-center">
                        <Spinner />
                    </div>
                )}
                <label className="w-24 h-24 cursor-pointer text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-md bg-gray-200 ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                    </svg>

                    <div>Upload</div>
                    <input type="file" onChange={uploadImages} className="hidden" />
                </label>
            </div>


            <button type="submit" className="btn-primary">Save</button>
        </form>
    )
}