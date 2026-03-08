import React, { useEffect, useState } from 'react'
import { userService, recipeService } from '../services/api'
import RecipeCard from '../components/RecipeCard'

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchMyRecipes() }, [])

  async function fetchMyRecipes() {
    try {
      const { data } = await userService.getProfile()
      setRecipes(data.recipes || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return
    try {
      await recipeService.deleteRecipe(id)
      fetchMyRecipes()
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  if (loading) return <div className="container">Loading recipes...</div>

  return (
    <div className="container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h2 style={{ margin: 0 }}>My Recipes</h2>
        <button className="btn" onClick={() => window.location.href = '/add'}>Create New Recipe</button>
      </div>

      {recipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 12 }}>
          You haven't created any recipes yet.
        </div>
      ) : (
        <div className="grid">
          {recipes.map(r => (
            <RecipeCard
              key={r.id}
              recipe={r}
              isManagement={true}
              onDelete={() => handleDelete(r.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
