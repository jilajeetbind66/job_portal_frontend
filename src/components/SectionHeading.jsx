import React from 'react'
import { motion } from 'framer-motion'

export default function SectionHeading({
  eyebrow,
  title,
  gradientWord = '',
  description,
  align = 'center',
  className = '',
}) {
  const alignClass = align === 'left' ? 'text-left items-start' : 'text-center items-center'

  const renderTitle = () => {
    if (!gradientWord || !title.includes(gradientWord)) {
      return title
    }
    const parts = title.split(gradientWord)
    return (
      <>
        {parts[0]}
        <span className="gradient-text font-bold">{gradientWord}</span>
        {parts[1]}
      </>
    )
  }

  return (
    <div className={`flex flex-col ${alignClass} max-w-4xl mx-auto mb-14 sm:mb-20 ${className}`}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-widest text-[#08B8F0] mb-4"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#08B8F0] animate-pulse" />
          {eyebrow}
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.05]"
      >
        {renderTitle()}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-white/65 max-w-2xl leading-relaxed font-normal"
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}

