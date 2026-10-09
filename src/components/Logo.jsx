import React from 'react'

export default function Logo({ className = "h-8", showText = true }) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official V/C Monogram Vector */}
      <svg
        width="34"
        height="34"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
        aria-label="VECOR AI Monogram"
      >
        <defs>
          <linearGradient id="vecorLogoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#08B8F0" />
            <stop offset="45%" stopColor="#0877E8" />
            <stop offset="75%" stopColor="#1239C7" />
            <stop offset="100%" stopColor="#32128F" />
          </linearGradient>
          <linearGradient id="vecorLogoGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#08B8F0" />
            <stop offset="60%" stopColor="#0877E8" />
            <stop offset="100%" stopColor="#1239C7" />
          </linearGradient>
          <filter id="vecorGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <path
          d="M8 10L20 32L32 10"
          stroke="url(#vecorLogoGrad1)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#vecorGlow)"
        />
        <path
          d="M28 12C24 8 16 8 12 12C8 16 8 24 12 28C16 32 24 32 28 28"
          stroke="url(#vecorLogoGrad2)"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        <circle cx="20" cy="20" r="3" fill="#08B8F0" />
      </svg>

      {showText && (
        <span className="font-bold tracking-tight text-xl text-white font-sans flex items-center gap-1.5">
          VECOR <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[#08B8F0]">AI PORTAL</span>
        </span>
      )}
    </div>
  )
}

