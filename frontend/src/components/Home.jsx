import { useNavigate } from 'react-router-dom'
import Button from './ui/Button'
import Card from './ui/Card'
import Container from './ui/Container'
import Heading from './ui/Heading'

export default function Home() {
  const navigate = useNavigate()

  return (
    <Container className="py-14">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.25)]" />
            Premium OTP Auth + Task Dashboard
          </div>

          <Heading className="mt-5 text-4xl leading-[1.05] text-white sm:text-5xl">
            Build your day with a fast,
            <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-emerald-200 bg-clip-text text-transparent">
              {' '}secure TODO flow
            </span>
          </Heading>

          <p className="mt-4 max-w-xl text-white/65">
            Drag-and-drop tasks, real-time dashboard metrics, and email OTP verification. Designed with reusable components and smooth animations.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" onClick={() => navigate('/login')}>
              Get started
              <span aria-hidden>→</span>
            </Button>
            <Button variant="primary" size="lg" onClick={() => navigate('/signup')}>
              Create account
            </Button>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { k: 'OTP verified', v: 'Secure' },
              { k: 'Protected routes', v: 'JWT' },
              { k: 'Task metrics', v: 'Live' },
            ].map((x) => (
              <Card key={x.k} className="p-4 transition hover:translate-y-[-2px]">
                <div className="text-xs font-extrabold text-white/55">{x.k}</div>
                <div className="mt-1 text-sm font-extrabold text-white">{x.v}</div>
              </Card>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-r from-cyan-400/20 via-fuchsia-400/20 to-emerald-400/20 blur-2xl" />
          <Card className="relative p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-extrabold text-white/80">Today’s dashboard</div>
                <div className="mt-1 text-xs text-white/55">Fast, clean, and premium.</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-extrabold text-white/70">
                DnD + Metrics
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { t: 'Total tasks', n: 12 },
                { t: 'Pending', n: 5 },
                { t: 'In progress', n: 4 },
                { t: 'Completed', n: 3 },
              ].map((m) => (
                <div
                  key={m.t}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/8"
                >
                  <div className="text-xs font-extrabold text-white/55">{m.t}</div>
                  <div className="mt-2 text-2xl font-extrabold text-white">{m.n}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs font-extrabold text-white/60">Next reminder</div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="text-sm font-extrabold text-white">Tomorrow 9:00 AM</div>
                <div className="h-10 w-10 rounded-2xl border border-white/15 bg-white/5 flex items-center justify-center">
                  🔔
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          { title: 'Reusable UI', desc: 'Glass cards, buttons, inputs, modal, toast.' },
          { title: 'Smooth animations', desc: 'Hover lifts, gradients, subtle motion.' },
          { title: 'Secure auth', desc: 'OTP email verification + JWT protected pages.' },
        ].map((f) => (
          <Card key={f.title} className="p-5 transition hover:translate-y-[-3px]">
            <div className="text-sm font-extrabold text-white">{f.title}</div>
            <div className="mt-2 text-sm text-white/60">{f.desc}</div>
          </Card>
        ))}
      </div>
    </Container>
  )
}

