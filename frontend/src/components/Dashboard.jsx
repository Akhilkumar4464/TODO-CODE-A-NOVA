import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return navigate('/login')

    ;(async () => {
      try {
        setError('')
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed to load profile')
        setProfile(data)
      } catch (e) {
        setError(e.message)
      }
    })()
  }, [navigate])

  const handleLogout = async () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div style={{ maxWidth: 720, margin: '40px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}

      {profile ? (
        <div style={{ marginTop: 20 }}>
          <p>
            <b>Name:</b> {profile.UserName}
          </p>
          <p>
            <b>Email:</b> {profile.gmail}
          </p>
          <p>
            <b>Created:</b> {new Date(profile.timestamp).toLocaleString()}
          </p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  )
}

