import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Card from './ui/Card'
import Container from './ui/Container'
import Heading from './ui/Heading'
import Input from './ui/Input'
import Button from './ui/Button'
import Toast from './ui/Toast'
import PageShell from './layout/PageShell'

export default function Signup() {
  const navigate = useNavigate()

  const [UserName, setUserName] = useState('')
  const [gmail, setGmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setToast(null)
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ UserName, gmail, password }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Signup failed')

      setToast({ message: 'Registration successful! Verification code sent.', type: 'success' })
      localStorage.setItem('pending_gmail', gmail)
      
      // Delay navigation slightly so user sees success toast
      setTimeout(() => {
        navigate('/verify-otp', { state: { gmail } })
      }, 1000)
    } catch (err) {
      const errMsg = err.message || 'Signup failed'
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
              <Heading className="text-3xl text-white">Join Code-A-Nova</Heading>
              <p className="mt-2 text-sm text-white/60">
                Get started today and secure your tasks.
              </p>
            </div>

            <form onSubmit={handleRegister} className="mt-8 grid gap-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={UserName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />

              <Input
                label="Email address"
                type="email"
                placeholder="john@gmail.com"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                hint="Must be at least 6 characters."
              />

              {error && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm font-semibold text-rose-200">
                  {error}
                </div>
              )}

              <Button type="submit" variant="secondary" className="mt-2 w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-white/55">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-white/80 hover:text-white hover:underline">
                Sign in
              </Link>
            </div>
          </Card>
        </div>
      </Container>
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </PageShell>
  )
}
