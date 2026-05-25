import React from 'react'

export default function Heading({ as: As = 'h1', className = '', ...props }) {
  return (
    <As
      className={`text-pretty font-extrabold tracking-tight ${className}`.trim()}
      {...props}
    />
  )
}

