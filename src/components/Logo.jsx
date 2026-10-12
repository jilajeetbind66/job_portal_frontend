import React from 'react'

export default function Logo({
  className = "h-8",
  showText = true,
  isDark = false,
  imageClassName = "h-8 w-auto",
}) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Vcreateventures Company Logo */}
      <img
        src="/logo.png"
        alt="Vcreateventures"
        className={`object-contain shrink-0 transition-transform duration-300 hover:scale-105 ${imageClassName} ${
          isDark ? 'drop-shadow-[0_2px_4px_rgba(255,255,255,0.25)]' : ''
        }`}
      />

      {showText && (
        <span
          className={`font-extrabold tracking-tight text-xl font-sans flex items-center gap-1.5 ${
            isDark ? 'text-white' : 'text-[#2F3542]'
          }`}
        >
          Vcreateventures
        </span>
      )}
    </div>
  )
}


