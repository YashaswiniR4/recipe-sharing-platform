import React, { useEffect, useState } from 'react'
import { userService, authService } from '../services/api'
import RecipeCard from '../components/RecipeCard'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [stats, setStats] = useState({ total_recipes: 0, total_favorites: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchProfile() }, [])

  async function fetchProfile() {
    try {
      const { data } = await userService.getProfile()
      setUser(data.user)
      setRecipes(data.recipes)
      setStats(data.stats)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container">Loading profile...</div>

  return (
    <div className="container fade-in">
      <div className="profile-header card" style={{ padding: 32, marginBottom: 32, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 80, height: 80, background: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700 }}>
            {user?.name?.[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#fff' }}>{user?.name}</h2>
            <div style={{ opacity: 0.8 }}>{user?.email}</div>
          </div>
          <button
            className="btn right"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
            onClick={() => authService.logout()}
          >
            Logout
          </button>
        </div>

        <div style={{ display: 'flex', gap: 40, marginTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.total_recipes}</div>
            <div style={{ opacity: 0.7, fontSize: 14, textTransform: 'uppercase', letterSpacing: '1px' }}>Recipes Created</div>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.total_favorites}</div>
            <div style={{ opacity: 0.7, fontSize: 14, textTransform: 'uppercase', letterSpacing: '1px' }}>Favorites Saved</div>
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: 20 }}>My Recipes</h3>
      {recipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 12 }}>
          You haven't created any recipes yet. <br />
          <button className="btn" style={{ marginTop: 16 }} onClick={() => window.location.href = '/add'}>Create Now</button>
        </div>
      ) : (
        <div className="grid">
          {recipes.map(r => <RecipeCard key={r.id} recipe={r} isManagement={true} onDelete={fetchProfile} />)}
        </div>
      )}
    </div>
  )
}
