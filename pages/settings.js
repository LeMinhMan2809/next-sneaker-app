import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
function SettingsPage({ swal }) {
    const [inventory, setInventory] = useState([])
    const [featuredProductId, setFeaturedProductId] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [shippingFee, setShippingFee] = useState('')

    useEffect(() => {
        setIsLoading(true)
        fetchAll().then(() => {
            setIsLoading(false);
        })
    }, [])

    async function fetchAll() {
        await axios.get('/api/inventory').then(response => {
            setInventory(response.data)
        })
        await axios.get('/api/settings?name=featuredProductId').then(response => {
            setFeaturedProductId(response.data.value)
        })
        await axios.get('/api/settings?name=shippingFee').then(res => {
            setShippingFee(res.data.value);
        });
    }

    async function saveSettings() {
        if (shippingFee === "") {
            document.getElementById('shippingFee').style.display = "block"
        }
        else {
            setIsLoading(true)
            await axios.put('/api/settings', {
                name: 'featuredProductId',
                value: featuredProductId,
            })
            await axios.put('/api/settings', {
                name: 'shippingFee',
                value: shippingFee,
            })
            setIsLoading(false)
            await swal.fire({
                icon: 'success',
                title: 'Settings saved',
            })
        }
    }

    return (
        <Layout>
            <h1 className="text-4xl font-bold mb-5">Settings</h1>
            {isLoading && (
                <Spinner fullWidth={true}></Spinner>
            )}
            {!isLoading && (
                <>
                    <div className="border-2 border-[#4b5563] py-8 px-5 rounded-md mb-5">
                        <div className="flex items-center gap-5 mb-5">
                            <h2 className="font-bold text-xl">Featured Product</h2>
                            <select className="border-2 border-[#d1d5db] focus:outline-none p-2 rounded-md" value={featuredProductId} onChange={ev => setFeaturedProductId(ev.target.value)}>
                                {inventory.length > 0 && inventory.map(i => (
                                    <option key={i.product._id} value={i.product._id}>{i.product.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-5 mb-5">
                            <h2 className="font-bold text-xl">Shipping Price (in vnd)</h2>
                            <input className="border-2 border-[#d1d5db] focus:outline-none p-2 rounded-md" type="number" value={shippingFee} onChange={ev => setShippingFee(ev.target.value)} />
                        </div>
                        <div id="shippingFee" className="hidden text-red-500 mb-3">Shipping Price is required</div>
                        <div>
                            <button className="bg-[#4f46e5] p-2 px-4 rounded-lg text-white" onClick={saveSettings}>Save settings</button>
                        </div>
                    </div>
                </>
            )}
        </Layout>
    )
}

export default withSwal(({ swal }) => (
    <SettingsPage swal={swal} />
));