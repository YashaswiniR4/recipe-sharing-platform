import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { recipeService, favoriteService, ratingService } from '../services/api'
import CommentSection from '../components/CommentSection'
import RatingStars from '../components/RatingStars'

export default function RecipeDetail() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchRecipe()
    checkFavorite()
  }, [id])

  async function fetchRecipe() {
    try {
      const { data } = await recipeService.getRecipeById(id)
      setRecipe(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function checkFavorite() {
    if (!token) return
    try {
      const { data } = await favoriteService.getFavorites()
      setIsFavorite(data.some(f => f.id == id))
    } catch (err) {
      console.error(err)
    }
  }

  async function toggleFavorite() {
    if (!token) return alert('Please login to save favorites')
    try {
      if (isFavorite) {
        await favoriteService.removeFavorite(id)
        setIsFavorite(false)
      } else {
        await favoriteService.addFavorite(id)
        setIsFavorite(true)
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleRating(rating) {
    if (!token) return alert('Please login to rate recipes')
    try {
      await ratingService.rateRecipe(id, rating)
      fetchRecipe() // Refresh to update avg rating
      alert('Thanks for rating!')
    } catch (err) {
      console.error(err)
    }
  }

  if (!recipe) return (
    <div className="container" style={{ textAlign: 'center', padding: 40 }}>
      <div className="fade-in">Loading recipe...</div>
    </div>
  )

  return (
    <div className="container fade-in">
      <div className="recipe-hero" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>{recipe.title}</h2>
          <button
            className={`btn ${isFavorite ? '' : 'secondary'}`}
            onClick={toggleFavorite}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {isFavorite ? '❤️ Saved' : '🤍 Save to Favorites'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <span className="badge">{recipe.category}</span>
          <span className="badge">By {recipe.author_name || 'Chef'}</span>
        </div>

        {recipe.image_url && (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            style={{ width: '100%', maxHeight: 500, objectFit: 'cover', borderRadius: 16, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
          />
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
        <div className="recipe-info">
          <div className="info-section" style={{ marginBottom: 32 }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 8, marginBottom: 12 }}>Ingredients</h3>
            <div style={{ whiteSpace: 'pre-line', lineHeight: '1.7', color: '#444' }}>
              {recipe.ingredients}
            </div>
          </div>

          <div className="info-section">
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 8, marginBottom: 12 }}>Method</h3>
            <div style={{ lineHeight: '1.7', color: '#444' }}>
              {recipe.description}
            </div>
          </div>
        </div>

        <div className="recipe-interaction">
          <div className="card" style={{ padding: 24, marginBottom: 32 }}>
            <h3>Chef's Choice</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <RatingStars value={parseFloat(recipe.average_rating) || 0} />
              <span className="muted">({parseFloat(recipe.average_rating).toFixed(1)} / 5.0)</span>
            </div>
            <div style={{ borderTop: '1px solid #eee', marginTop: 16, paddingTop: 16 }}>
              <div className="muted" style={{ fontSize: 14, marginBottom: 8 }}>Rate this recipe:</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24 }}
                  >
                    {star <= (parseFloat(recipe.average_rating) || 0) ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <CommentSection recipeId={id} />
        </div>
      </div>
    </div>
  )
}
