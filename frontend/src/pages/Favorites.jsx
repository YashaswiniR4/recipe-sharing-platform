import React, { useEffect, useState } from 'react'
import { favoriteService } from '../services/api'
import RecipeCard from '../components/RecipeCard'

export default function Favorites() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchFavorites() }, [])

  async function fetchFavorites() {
    try {
      const { data } = await favoriteService.getFavorites()
      setRecipes(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container">Loading...</div>

  return (
    <div className="container fade-in">
      <h2 style={{ marginBottom: 24 }}>Your Favorite Recipes</h2>
      {recipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 12 }}>
          No favorites yet. Start exploring and save some!
        </div>
      ) : (
        <div className="grid">
          {recipes.map(r => <RecipeCard key={r.id} recipe={r} isFavoritePage={true} onRemove={fetchFavorites} />)}
        </div>
      )}
    </div>
  )
}
