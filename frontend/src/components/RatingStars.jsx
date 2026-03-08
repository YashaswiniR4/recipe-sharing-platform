import React from 'react'

export default function RatingStars({ value = 0 }) {
  const stars = Math.round(value)
  return (
    <div style={{ color: '#f59e0b', fontSize: 18, display: 'inline-flex', letterSpacing: 2 }}>
      {[...Array(5)].map((_, i) => (
        <span key={i}>{i < stars ? '★' : '☆'}</span>
      ))}
    </div>
  )
}
