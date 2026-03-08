import React from 'react'
import { Link } from 'react-router-dom'
import RatingStars from './RatingStars'

export default function RecipeCard({ recipe, isManagement, onDelete, isFavoritePage, onRemove }) {
  return (
    <article className="card fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ position: 'relative' }}>
        {recipe.image_url ? (
          <img src={recipe.image_url} alt={recipe.title} style={{ height: 200 }} />
        ) : (
          <div style={{ height: 200, background: 'linear-gradient(45deg, #f1f5f9 0%, #e2e8f0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🍲</div>
        )}
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', fontWeight: 600 }}>{recipe.category || 'Recipe'}</span>
        </div>
      </div>

      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 className="card-title" style={{ marginBottom: 8 }}>{recipe.title}</h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <RatingStars value={Number(recipe.average_rating) || 0} />
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>({Number(recipe.average_rating).toFixed(1)})</span>
        </div>

        <p className="card-desc" style={{ fontSize: 14, color: '#444', marginBottom: 20 }}>
          {recipe.description ? (recipe.description.length > 90 ? recipe.description.slice(0, 87) + '...' : recipe.description) : 'No description provided.'}
        </p>

        <div className="card-footer" style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
          <Link to={`/recipe/${recipe.id}`} className="btn" style={{ padding: '6px 14px', fontSize: 14 }}>View Details</Link>

          <div style={{ display: 'flex', gap: 8 }}>
            {isManagement && (
              <>
                <Link to={`/edit/${recipe.id}`} className="btn secondary" style={{ padding: '6px 14px' }}>Edit</Link>
                <button className="btn secondary" onClick={onDelete} style={{ padding: '6px 10px', background: '#fee2e2', color: '#ef4444' }}>Delete</button>
              </>
            )}
            {isFavoritePage && (
              <button className="btn secondary" onClick={onRemove} style={{ padding: '6px 10px' }}>Remove</button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
