import React, { useState } from 'react'
import Card from '../ui/Card'
import Container from '../ui/Container'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Toast from '../ui/Toast'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const [toast, setToast] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setToast(null)

    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Contact failed')

      setSuccess('Message sent. We will get back to you soon!')
      setToast({ message: 'Sent successfully', type: 'success' })
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      const msg = err?.message || 'Contact failed'
      setError(msg)
      setToast({ message: msg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Contact</h1>
          <p className="mt-2 text-white/60">
            Send a message to the team. If SMTP is not configured, emails will be logged to backend console.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-5">
        <div className="md:col-span-3">
          <Card className="p-6 md:p-7">
            <form onSubmit={submit} className="grid gap-4">
              <Input label="Your Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John" />
              <Input
                label="Your Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@gmail.com"
              />
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-white/90">Message</label>
                <textarea
                  className="min-h-[140px] w-full resize-y rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-white/30 focus:bg-white/8"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Write your message..."
                />
              </div>

              {error ? <div className="text-sm font-semibold text-rose-200">{error}</div> : null}
              {success ? <div className="text-sm font-semibold text-emerald-200">{success}</div> : null}

              <Button type="submit" disabled={loading} className="mt-2">
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="p-6 md:p-7">
            <h2 className="text-lg font-extrabold text-white">Support</h2>
            <p className="mt-2 text-sm text-white/60">
              For internship submissions, make sure your backend SMTP env vars are set OR rely on console fallback.
            </p>
            <div className="mt-4 text-sm text-white/70">
              <div className="font-semibold text-white/90">Email</div>
              <div>
                <a className="font-semibold text-white/80 hover:text-white" href="mailto:codenova31@gmail.com">
                  codenova31@gmail.com
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </Container>
  )
}

