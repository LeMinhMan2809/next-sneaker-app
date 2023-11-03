import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Categories () {
    const [editedCategory, setEditedCategory] = useState(null)
    const [name, setName] = useState('')
    const [parentCategory, setParentCategory] = useState('')
    const [categories, setCategories] = useState([])
    useEffect(()=> {
       fetchCategories()
},[])

    function fetchCategories (){
        axios.get('/api/categories').then(result => {
            setCategories(result.data)
    })
    }
    async function saveCategory(e){
        e.preventDefault()
        const data = {name, parentCategory}
        if(editedCategory){
            data._id = editedCategory._id
            await axios.put('/api/categories/', data)
            setEditedCategory(null)
        }else{
            await axios.post('/api/categories', data)
        }
        setName('')
        fetchCategories()
    }

    function editCategory (category){
        setEditedCategory(category)
        setName(category.name)
        setParentCategory(category.parent?._id)
    }

    return (
        <Layout>
            <h1>Categories</h1> 
            <label>{editedCategory ? `Edit category ${editedCategory.name}` : 'Create new category'}</label>
            <form onSubmit={saveCategory} className="flex gap-2">
                <input className="mb-0" type="text" 
                placeholder={'New category name'}
                value={name} onChange={e => setName(e.target.value)}/>    
                  <label for=""></label>
                <select className="mb-0" value={parentCategory} onChange={e => setParentCategory(e.target.value)}>
                    <option value="">No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                    <option value={category._id}>{category.name}</option>
                   ))}
                </select>
                <button type="submit" className="btn-primary py-1">Save</button>
            </form>

            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category name</td>
                        <td>Parent category</td>
                        <td>Actions</td>
                    </tr>
                </thead>
                <tbody className="text-left">
                    {categories.length > 0 && categories.map
                    (category => (
                        <tr>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td>
                                <button 
                                    onClick={() => editCategory(category)} 
                                    className="btn-primary mr-2">
                                        Edit
                                </button>
                                <button className="btn-primary">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
        
        
        
    )
}