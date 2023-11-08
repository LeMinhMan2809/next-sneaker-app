import Layout from "@/components/Layout"
import { useState, useEffect } from "react"
import axios from "axios"
import ReactPaginate from "react-paginate";
import Spinner from "@/components/Spinner";
import Swal from 'sweetalert2';
import { set } from "date-fns";
import React from 'react';

export default function Inventory() {
    const [editedSize, setEditedSize] = useState(null)
    const [inventory, setInventory] = useState([])
    const [allInventory, setAllInventory] = useState([])
    const [searchProduct, setSearchProduct] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const [productIDs, setProductIDs] = useState('')
    const [sizes, setSizes] = useState([])

    const itemsPerPage = 5
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = inventory.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(inventory.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % inventory.length;
        setItemOffset(newOffset);
    };

    useEffect(() => {
        setIsLoading(true)
        axios.get('/api/inventory').then(response => {
            setInventory(response.data)
            setAllInventory(response.data)
            setIsLoading(false)
        })
    }, [])

    useEffect(() => {
        setInventory(allInventory.filter(inventory => inventory.product._id.toLowerCase().includes(searchProduct.toLowerCase())))
        setItemOffset(0)
    }, [searchProduct])

    async function saveInventory(ev) {
        ev.preventDefault()
        if (!productIDs || sizes.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
            })
            return
        }
        for (let i = 0; i < sizes.length; i++) {
            if (!sizes[i].name || !sizes[i].quantity || !sizes[i].price) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please fill all sizes information!',
                })
                return
            }
            if (sizes[i].quantity < 0 || sizes[i].price < 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Quantity and Price is invalid!',
                })
                return
            }
        }
        const existingProduct = await axios.get('/api/products?id=' + productIDs)
        if (!existingProduct.data) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Product ID not found in Product Details!',
            })
            return
        }

        if (!editedSize) {
            const existingInventory = await axios.get('/api/inventory?productIDs=' + productIDs)
            if (existingInventory.data) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Product ID already exists in Inventory!',
                })
                return
            }
        }

        let total = 0
        for (let i = 0; i < sizes.length; i++) {
            total += sizes[i].quantity
        }

        const data = { productIDs, total, sizes }
        let newInventory = null
        if (editedSize) {
            data._id = editedSize._id
            newInventory = await axios.put('/api/inventory', data)
        }
        else {
            newInventory = await axios.post('/api/inventory', data)
        }

        if (newInventory.data) {
            setProductIDs('')
            setSizes([])
            setEditedSize(null)
            setIsLoading(true)
            axios.get('/api/inventory').then(response => {
                setInventory(response.data)
                setAllInventory(response.data)
                setIsLoading(false)
            })
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Inventory saved successfully!',
                confirmButtonText: 'OK'
            })
        }
    }

    async function getUpdate(inventory) {
        setProductIDs(inventory.product._id)
        setEditedSize(inventory)
        setSizes(inventory.size)
    }

    async function getRemove(id, productID, productName) {
        Swal.fire({
            title: 'Delete inventory?',
            text: `Are you sure you want to delete ${productID} - ${productName} from inventory?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const removeInventory = await axios.delete('/api/inventory?_id=' + id)
                if (removeInventory.data) {
                    setIsLoading(true)
                    axios.get('/api/inventory').then(response => {
                        setInventory(response.data)
                        setAllInventory(response.data)
                        setIsLoading(false)
                    })
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Inventory removed successfully!',
                        confirmButtonText: 'OK'
                    })
                }
            }
        })
    }

    function addSize() {
        setSizes(prev => {
            return [...prev, { name: '', quantity: 0, price: 0 }]
        })
    }

    function removeSize(indexToRemove) {
        setSizes(prev => {
            return [...prev].filter((s, sIndex) => {
                return sIndex !== indexToRemove
            })
        })
    }

    function handleSizeNameChange(index, size, newName) {
        setSizes(prev => {
            const sizes = [...prev]
            sizes[index].name = newName
            return sizes
        })
    }
    function handleSizeQuantityChange(index, size, value) {
        const newQuantity = parseInt(value, 10) || 0;
        setSizes(prev => {
            const sizes = [...prev]
            sizes[index].quantity = newQuantity
            return sizes
        })
    }
    function handleSizePriceChange(index, size, value) {
        const newPrice = parseFloat(value) || 0.0;
        setSizes(prev => {
            const sizes = [...prev]
            sizes[index].price = newPrice
            return sizes
        })
    }

    return (
        <Layout>
            <h1 className="text-4xl font-bold mb-5">Inventory</h1>
            <h2 className="font-bold text-xl mb-2">{editedSize ? 'Edit Inventory' : 'Add Product to Inventory'}</h2>
            <form onSubmit={saveInventory} className="flex flex-col gap-3">
                <input type="text" className="w-[50%] border-2 border-[#4b5563] focus:border-[#536ced] focus:outline-none p-2 rounded-md" placeholder="Product IDs" value={productIDs} onChange={ev => setProductIDs(ev.target.value)}></input>
                <button type="button" onClick={addSize} className="bg-white hover:bg-gray-100 border-2 border-[#d1d5db] text-sm py-2 px-4 rounded-md flex justify-center">Add new size</button>
                {sizes.length > 0 && sizes.map((size, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                        <input type="text" className="w-full border-2 border-[#ds1d5db] focus:outline-none p-2 rounded-md" value={size.name} onChange={ev => handleSizeNameChange(index, size, ev.target.value)} placeholder="Size"></input>
                        <input type="number" className="w-full border-2 border-[#d1d5db] focus:outline-none p-2 rounded-md" value={size.quantity} onChange={ev => handleSizeQuantityChange(index, size, ev.target.value)} placeholder="Quantity"></input>
                        <input type="number" className="w-full border-2 border-[#d1d5db] focus:outline-none p-2 rounded-md" value={size.price} onChange={ev => handleSizePriceChange(index, size, ev.target.value)} placeholder="Price"></input>
                        <button type="button" className="bg-rose-600 p-1 rounded-lg text-white" onClick={() => removeSize(index)}>Remove</button>
                    </div>
                ))}
                <button type="submit" className="bg-[#4f46e5] p-2 px-4 rounded-lg text-white w-fit">Save</button>
            </form>
            <div className="overflow-auto">
                <div className="mt-8 flex justify-between">
                    <h2 className="font-bold text-xl mb-2">Available inventory:</h2>
                    <input className="w-[300px] py-2 px-3 rounded-lg bg-inherit border-2 outline-none border-[#4b5563] focus:border-[#4f46e5]" type="text" onChange={ev => setSearchProduct(ev.target.value)} placeholder="Search for Products IDs..."></input>
                </div>
                <table className="basic mt-4">
                    <colgroup>
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '40%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <td>Product IDs</td>
                            <td>Product Name</td>
                            <td>Quantity</td>
                            <td colSpan={2} className="text-center">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan={5}>
                                    <div className="py-4">
                                        <Spinner fullWidth={true}></Spinner>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {currentItems.map((inventory, index) => (
                            <React.Fragment key={index}>
                                <tr key={inventory._id}>
                                    <td>{inventory.product._id}</td>
                                    <td className="">
                                        <div className="rounded-md flex gap-3 items-center">
                                            <img className="bg-white w-[80px] rounded-md" src={inventory.product.images[0]} />
                                            <p className="text-xl">{inventory.product.title}</p>
                                        </div>
                                    </td>
                                    <td>{inventory.totalQuantity}</td>
                                    <td className="pl-4 py-2 whitespace-nowrap">
                                        <button className="bg-emerald-400 py-3 px-4 rounded-md text-white" onClick={() => getUpdate(inventory)}>Update</button>
                                    </td>
                                    <td className="pl-4 py-2 whitespace-nowrap">
                                        <button className="bg-rose-500 py-3 px-4 rounded-md text-white" onClick={() => getRemove(inventory._id, inventory.product._id, inventory.product.title)}>Remove</button>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-3 text-center ml-[-4px]">
                <ReactPaginate
                    marginPagesDisplayed={3}
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={pageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                    containerClassName={'pagination flex'}
                    activeLinkClassName={'active'}
                />
            </div>
        </Layout>
    )
}