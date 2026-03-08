import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    try {
      const { data } = await authService.login({ email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Welcome back</h2>
        <div className="auth-sub">Sign in to continue to RecipeShare</div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <div className="form-group">
            <button className="btn full-btn" type="submit">Sign in</button>
          </div>
        </form>

        <div className="link-row">
          <div className="auth-note">Don't have an account? <Link to="/register">Register</Link></div>
        </div>
      </div>
    </div>
  )
}
