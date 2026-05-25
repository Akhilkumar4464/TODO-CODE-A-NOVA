import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function VerifyOtp() {
  const navigate = useNavigate()
  const location = useLocation()

  // We expect gmail to be passed from Signup page via location.state
  const gmail = location.state?.gmail || localStorage.getItem('pending_gmail') || ''

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gmail, otp }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'OTP verification failed')

      localStorage.removeItem('pending_gmail')
      navigate('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h1>Verify OTP</h1>
      <p>Enter the 6-digit OTP sent to <b>{gmail}</b></p>

      <form onSubmit={handleVerify} style={{ display: 'grid', gap: 12 }}>
        <input
          inputMode="numeric"
          pattern="\\d{6}"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
    </div>
  )
}

