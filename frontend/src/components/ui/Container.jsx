import React from 'react'

export default function Container({ className = '', children }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`.trim()}>
      {children}
    </div>
  )
}

