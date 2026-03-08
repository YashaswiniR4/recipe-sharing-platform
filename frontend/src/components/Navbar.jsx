import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { authService } from '../services/api'

export default function Navbar() {
  const token = localStorage.getItem('token')
  const user = authService.getCurrentUser()

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🍲</span>
          <span>RecipeShare</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Discover</NavLink>
          {token && (
            <>
              <NavLink to="/add" className={({ isActive }) => isActive ? 'active' : ''}>Add Recipe</NavLink>
              <NavLink to="/favorites" className={({ isActive }) => isActive ? 'active' : ''}>Favorites</NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>Profile</NavLink>
            </>
          )}
        </nav>

        <div className="nav-actions">
          {token ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 14, opacity: 0.8 }}>Hi, {user?.name || 'Chef'}</span>
              <button className="btn secondary" onClick={() => authService.logout()}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/login" style={{ textDecoration: 'none', color: '#fff', fontSize: 14 }}>Login</Link>
              <Link to="/register" className="btn" style={{ textDecoration: 'none' }}>Join Free</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
