import React from 'react'

function stringToHue(str = '') {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return Math.abs(hash) % 360
}

export default function Avatar({ name = '', size = 40 }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('')

  const hue = stringToHue(name)

  return (
    <div
      style={{ width: size, height: size, background: `hsl(${hue} 90% 50% / 0.25)` }}
      className="flex items-center justify-center rounded-2xl border border-white/15 backdrop-blur"
    >
      <span className="text-sm font-extrabold text-white">{initials || 'U'}</span>
    </div>
  )
}

