import Layout from "@/components/Layout"
import { useState, useEffect } from "react"
import axios from "axios"
import ReactPaginate from "react-paginate";
import Spinner from "@/components/Spinner";
import Swal from 'sweetalert2';

export default function Inventory() {
    const [inventory, setInventory] = useState([])
    const [allInventory, setAllInventory] = useState([])
    const [searchProduct, setSearchProduct] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const [productIDs, setProductIDs] = useState('')
    const [quantity, setQuantity] = useState('')
    const [price, setPrice] = useState('')

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
        if (!productIDs || !quantity || !price) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
            })
            return
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
        const existingInventory = await axios.get('/api/inventory?productIDs=' + productIDs)
        if (existingInventory.data) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Product ID already exists in Inventory!',
            })
            return
        }
        const data = { productIDs, quantity, price }
        const newInventory = await axios.post('/api/inventory', data)
        if (newInventory.data) {
            setProductIDs('')
            setQuantity('')
            setPrice('')
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

    async function getUpdate(id, oldQuantity, oldPrice, newQuantity, newPrice) {
        const data = { id, newQuantity, newPrice }
        const updateInventory = await axios.put('/api/inventory', data)
        if (updateInventory.data) {
            setIsLoading(true)
            axios.get('/api/inventory').then(response => {
                setInventory(response.data)
                setAllInventory(response.data)
                setIsLoading(false)
            })
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Inventory updated successfully!',
                confirmButtonText: 'OK'
            })
        }
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

    return (
        <Layout>
            <h1 className="text-4xl font-bold mb-5">Inventory</h1>
            <h2 className="font-bold text-xl mb-2">Add Product to Inventory</h2>
            <form onSubmit={saveInventory} className="flex flex-col gap-3">
                <input type="text" className="w-[50%] dark:bg-[#1f2938] border-2 border-[#d1d5db] dark:border-[#4b5563] focus:border-[#FFA07A] dark:focus:border-[#536ced] focus:outline-none p-2 rounded-md" placeholder="Product IDs" value={productIDs} onChange={ev => setProductIDs(ev.target.value)}></input>
                <input type="number" className="w-[50%] dark:bg-[#1f2938] border-2 border-[#d1d5db] dark:border-[#4b5563] focus:border-[#FFA07A] dark:focus:border-[#536ced] focus:outline-none p-2 rounded-md" placeholder="Quantity" value={quantity} onChange={ev => setQuantity(ev.target.value)}></input>
                <input type="number" className="w-[50%] dark:bg-[#1f2938] border-2 border-[#d1d5db] dark:border-[#4b5563] focus:border-[#FFA07A] dark:focus:border-[#536ced] focus:outline-none p-2 rounded-md" placeholder="Price" value={price} onChange={ev => setPrice(ev.target.value)}></input>
                <button type="submit" className="bg-[#4f46e5] p-2 px-4 rounded-lg text-white w-fit">Save</button>
            </form>
            <div className="overflow-auto">
                <div className="mt-8 flex justify-between">
                    <h2 className="font-bold text-xl mb-2">Available inventory:</h2>
                    <input className="w-[300px] py-2 px-3 rounded-lg bg-inherit border-2 outline-none border-[#4b5563] focus:border-[#4f46e5]" type="text" onChange={ev => setSearchProduct(ev.target.value)} placeholder="Search for Products IDs..."></input>
                </div>
                <table className="basic mt-4">
                    <colgroup>
                        <col style={{ width: '23%' }} />
                        <col style={{ width: '31%' }} />
                        <col style={{ width: '11%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '8%' }} />
                        <col style={{ width: '8%' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <td>Product IDs</td>
                            <td>Product Name</td>
                            <td>Quantity</td>
                            <td>Price</td>
                            <td colSpan={2} className="text-center">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan={6}>
                                    <div className="py-4">
                                        <Spinner fullWidth={true}></Spinner>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {currentItems.map((inventory) => {
                            let inputQuantity = inventory.quantity;
                            let inputPrice = inventory.price;
                            return (
                                <tr key={inventory._id}>
                                    <td>{inventory.product._id}</td>
                                    <td className="">
                                        <div className="rounded-md flex gap-3 items-center">
                                            <img className="bg-white w-[80px] rounded-md" src={inventory.product.images[0]} />
                                            <p className="text-xl">{inventory.product.title}</p>
                                        </div>
                                    </td>
                                    <td><input className="w-full p-2 border-2 border-gray-400 rounded-md box-border" type="number" defaultValue={inventory.quantity} onChange={(e) => (inputQuantity = e.target.value)}></input></td>
                                    <td><input className="w-full p-2 border-2 border-gray-400 rounded-md box-border" type="number" defaultValue={inventory.price} onChange={(e) => (inputPrice = e.target.value)}></input></td>
                                    <td className="pl-4 py-2 whitespace-nowrap">
                                        <button className="bg-emerald-400 py-3 px-4 rounded-md text-white" onClick={() => getUpdate(inventory._id, inventory.quantity, inventory.price, inputQuantity, inputPrice)}>Update</button>
                                    </td>
                                    <td className="pl-4 py-2 whitespace-nowrap">
                                        <button className="bg-rose-500 py-3 px-4 rounded-md text-white" onClick={() => getRemove(inventory._id, inventory.product._id, inventory.product.title)}>Remove</button>
                                    </td>
                                </tr>
                            )
                        })}
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