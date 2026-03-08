import React, { useState, useEffect } from 'react'
import { commentService } from '../services/api'

export default function CommentSection({ recipeId }) {
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => { fetchComments() }, [recipeId])

  async function fetchComments() {
    try {
      const { data } = await commentService.getComments(recipeId)
      setComments(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  async function handleAdd() {
    if (!token) return alert('Please login to post comments')
    if (!text) return
    try {
      await commentService.addComment({ recipe_id: recipeId, comment: text })
      setText('')
      fetchComments()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 style={{ marginBottom: 18 }}>Discussions ({comments.length})</h3>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <input
          className="input"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Share your thoughts..."
          style={{ flex: 1 }}
        />
        <button className="btn" onClick={handleAdd}>Post Comment</button>
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {comments.map(c => (
          <div key={c.id} style={{ borderTop: '1px solid #f1f5f9', padding: '16px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{c.user_name || 'Chef'}</span>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(c.created_at).toLocaleDateString()}</span>
            </div>
            <div style={{ fontSize: 14, color: '#334155', lineHeight: '1.5' }}>{c.comment}</div>
          </div>
        ))}
        {comments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted)', fontSize: 14 }}>
            Be the first to comment on this recipe!
          </div>
        )}
      </div>
    </div>
  )
}
