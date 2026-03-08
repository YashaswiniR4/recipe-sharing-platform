import React, { useState } from 'react'
import { recipeService } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function AddRecipe() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [category, setCategory] = useState('')
  const [file, setFile] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    if (!localStorage.getItem('token')) {
      alert('Please login to add recipes')
      navigate('/login')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('ingredients', ingredients)
    formData.append('category', category)
    if (file) formData.append('image', file)

    try {
      await recipeService.createRecipe(formData)
      alert('Recipe created successfully')
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create recipe')
    }
  }

  const categories = ['Indian', 'Italian', 'Dessert', 'Fast Food', 'Healthy', 'Vegan']

  return (
    <div className="container fade-in">
      <h2 style={{ textAlign: 'center', marginTop: 24, marginBottom: 24 }}>Add a New Recipe</h2>
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Recipe Title</label>
            <input className="input" placeholder="e.g. Grandma's Pasta" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="input" placeholder="A short story about your dish..." value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Ingredients</label>
            <textarea className="input" placeholder="List ingredients separated by commas or lines..." value={ingredients} onChange={e => setIngredients(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select className="input" value={category} onChange={e => setCategory(e.target.value)} required>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Recipe Image</label>
            <input type="file" className="input" onChange={e => setFile(e.target.files[0])} accept="image/*" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <button type="button" className="btn secondary" onClick={() => { setTitle(''); setDescription(''); setIngredients(''); setCategory(''); setFile(null) }}>Clear</button>
            <button className="btn" type="submit">Create Recipe</button>
          </div>
        </form>
      </div>
    </div>
  )
}
