import React, { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import Card from './ui/Card'
import Container from './ui/Container'
import Heading from './ui/Heading'
import Input from './ui/Input'
import Button from './ui/Button'
import Toast from './ui/Toast'
import PageShell from './layout/PageShell'

export default function VerifyOtp() {
  const navigate = useNavigate()
  const location = useLocation()

  // Extract pending email from state or storage
  const gmail = location.state?.gmail || localStorage.getItem('pending_gmail') || ''

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setToast(null)
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gmail, otp }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'OTP verification failed')

      localStorage.removeItem('pending_gmail')
      setToast({ message: 'Account verified successfully! Redirecting...', type: 'success' })

      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch (err) {
      const errMsg = err.message || 'Verification failed'
      setError(errMsg)
      setToast({ message: errMsg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <Container className="flex min-h-[75vh] items-center justify-center py-10">
        <div className="w-full max-w-md animate-fadeUp">
          <Card className="p-8 backdrop-blur-2xl">
            <div className="text-center">
              <Heading className="text-3xl text-white">Verify OTP</Heading>
              <p className="mt-2 text-sm text-white/60">
                We sent a 6-digit verification code to
              </p>
              <div className="mt-1 text-sm font-extrabold text-cyan-300">{gmail}</div>
            </div>

            <form onSubmit={handleVerify} className="mt-8 grid gap-5">
              <Input
                label="6-Digit Code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                className="text-center font-mono tracking-[0.4em] text-lg"
              />

              {error && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm font-semibold text-rose-200">
                  {error}
                </div>
              )}

              <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-white/55">
              Didn't receive a code?{' '}
              <Link to="/signup" className="font-semibold text-white/80 hover:text-white hover:underline">
                Register again
              </Link>
            </div>
          </Card>
        </div>
      </Container>
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </PageShell>
  )
}
