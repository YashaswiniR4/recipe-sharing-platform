import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { recipeService } from '../services/api'

export default function EditRecipe() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [ingredients, setIngredients] = useState('')
    const [category, setCategory] = useState('')
    const [file, setFile] = useState(null)
    const [currentImage, setCurrentImage] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => { fetchRecipe() }, [id])

    async function fetchRecipe() {
        try {
            const { data } = await recipeService.getRecipeById(id)
            setTitle(data.title)
            setDescription(data.description)
            setIngredients(data.ingredients)
            setCategory(data.category)
            setCurrentImage(data.image_url)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('ingredients', ingredients)
        formData.append('category', category)
        if (file) formData.append('image', file)

        try {
            await recipeService.updateRecipe(id, formData)
            alert('Recipe updated successfully')
            navigate(`/recipe/${id}`)
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update recipe')
        }
    }

    const categories = ['Indian', 'Italian', 'Dessert', 'Fast Food', 'Healthy', 'Vegan']

    if (loading) return <div className="container">Loading...</div>

    return (
        <div className="container fade-in">
            <h2 style={{ textAlign: 'center', marginTop: 24, marginBottom: 24 }}>Edit Your Recipe</h2>
            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Recipe Title</label>
                        <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="input" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Ingredients</label>
                        <textarea className="input" placeholder="Ingredients" value={ingredients} onChange={e => setIngredients(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select className="input" value={category} onChange={e => setCategory(e.target.value)} required>
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Change Recipe Image (Optional)</label>
                        {currentImage && (
                            <div style={{ marginBottom: 10 }}>
                                <img src={currentImage} alt="Current" style={{ height: 100, borderRadius: 8, border: '1px solid #ddd' }} />
                                <div className="muted" style={{ fontSize: 12 }}>Current Image</div>
                            </div>
                        )}
                        <input type="file" className="input" onChange={e => setFile(e.target.files[0])} accept="image/*" />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                        <button type="button" className="btn secondary" onClick={() => navigate(-1)}>Cancel</button>
                        <button className="btn" type="submit">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
