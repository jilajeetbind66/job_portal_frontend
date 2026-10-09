import React from 'react'
import { motion } from 'framer-motion'

export default function GlassCard({
  children,
  className = '',
  hoverEffect = true,
  glow = false,
  onClick,
}) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.25 } } : {}}
      className={`relative rounded-3xl bg-white/[0.06] backdrop-blur-[20px] border border-white/12 p-6 sm:p-8 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.08] overflow-hidden ${className}`}
    >
      {glow && (
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#08B8F0]/15 rounded-full filter blur-3xl pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

