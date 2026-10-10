import React from 'react'

export default function Logo({ className = "h-8", showText = true, isDark = false }) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* VECOR Leaf/Spark Brand Mark */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
        aria-label="VECOR Mark"
      >
        <rect width="40" height="40" rx="12" fill={isDark ? "#2F3542" : "#6A8E7F"} />
        <path
          d="M12 28L20 12L28 28"
          stroke="#BFEDC1"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="22" r="3" fill="#FFFFFF" />
      </svg>

      {showText && (
        <span className={`font-extrabold tracking-tight text-xl font-sans flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-[#2F3542]'}`}>
          VECOR
        </span>
      )}
    </div>
  )
}


