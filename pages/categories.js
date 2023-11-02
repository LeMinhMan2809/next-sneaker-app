import Layout from "@/components/Layout";
import Nav from "@/components/Nav";

export default function Categories () {
    const [name, setName] = useState('')
    return (
        <Layout>
            <h1>Categories</h1>
            <label>New category name</label>
            <form className="flex gap-2">
                <input className="mb-0" type="text" placeholder={'New category name'}/>
                <button type="submit" className="btn-primary py-1">Save</button>
            </form>

        </Layout>
        
        
        
    )
}