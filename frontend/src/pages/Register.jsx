import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()
    try {
      await authService.register({ name, email, password })
      alert('Registration successful. Please login.')
      navigate('/login')
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <div className="auth-sub">Join the community and share your recipes</div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <div className="form-group">
            <button className="btn full-btn" type="submit">Register</button>
          </div>
        </form>

        <div className="link-row">
          <div className="auth-note">Already have an account? <Link to="/login">Login</Link></div>
        </div>
      </div>
    </div>
  )
}
