import React from 'react'

export default function Marquee({ children, speed = 30, className = '' }) {
  return (
    <div className={`flex overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${className}`}>
      <div className="flex shrink-0 items-center gap-12 sm:gap-16 animate-marquee">
        {children}
      </div>
      <div className="flex shrink-0 items-center gap-12 sm:gap-16 animate-marquee" aria-hidden="true">
        {children}
      </div>
    </div>
  )
}

