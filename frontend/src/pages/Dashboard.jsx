import React, { useEffect, useState } from 'react'
import { recipeService } from '../services/api'
import RecipeCard from '../components/RecipeCard'

export default function Dashboard() {
  const [recipes, setRecipes] = useState([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [total, setTotal] = useState(0)
  const pageSize = 6

  useEffect(() => {
    fetchRecipes()
  }, [page, category])

  async function fetchRecipes() {
    try {
      const { data } = await recipeService.getRecipes({ search, category, page, limit: pageSize })
      setRecipes(data.recipes || [])
      setTotal(data.total || 0)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchRecipes()
  }

  const categories = ['Indian', 'Italian', 'Dessert', 'Fast Food', 'Healthy', 'Vegan']

  return (
    <div className="container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <h2>Discover Recipes</h2>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <input
            className="input"
            placeholder="Search recipes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '240px' }}
          />
          <button className="btn" type="submit">Search</button>
        </form>
      </div>

      <div className="category-filters" style={{ display: 'flex', gap: 10, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
        <button
          className={`btn ${category === '' ? '' : 'secondary'}`}
          onClick={() => { setCategory(''); setPage(1) }}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`btn ${category === cat ? '' : 'secondary'}`}
            onClick={() => { setCategory(cat); setPage(1) }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid">
        {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
      </div>

      {recipes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
          No recipes found. Try a different search or category.
        </div>
      )}

      <div className="pagination">
        <button
          className="btn secondary"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span style={{ alignSelf: 'center', color: 'var(--muted)' }}>Page {page}</span>
        <button
          className="btn secondary"
          onClick={() => setPage(p => p + 1)}
          disabled={page * pageSize >= total}
        >
          Next
        </button>
      </div>
    </div>
  )
}
