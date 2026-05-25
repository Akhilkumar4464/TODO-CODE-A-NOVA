import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Card from './ui/Card'
import Container from './ui/Container'
import Heading from './ui/Heading'
import Input from './ui/Input'
import Button from './ui/Button'
import Toast from './ui/Toast'
import PageShell from './layout/PageShell'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const [gmail, setGmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setToast(null)
    setLoading(true)

    try {
      await login(gmail, password)
      setToast({ message: 'Login successful! Redirecting...', type: 'success' })
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (err) {
      const errMsg = err.message || 'Login failed'
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
              <Heading className="text-3xl text-white">Welcome back</Heading>
              <p className="mt-2 text-sm text-white/60">
                Please enter your credentials to login.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-8 grid gap-4">
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
                required
              />

              {error && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm font-semibold text-rose-200">
                  {error}
                </div>
              )}

              <Button type="submit" variant="secondary" className="mt-2 w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-white/55">
              Don't have an account yet?{' '}
              <Link to="/signup" className="font-semibold text-white/80 hover:text-white hover:underline">
                Create one
              </Link>
            </div>
          </Card>
        </div>
      </Container>
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </PageShell>
  )
}
