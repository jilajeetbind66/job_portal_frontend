import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '@/components/Button'
import MagneticButton from '@/components/MagneticButton'

export default function CTA() {
  return (
    <section className="relative py-28 sm:py-40 px-4 sm:px-8 lg:px-16 overflow-hidden bg-[#05070D]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-[#08B8F0]/20 via-[#0877E8]/25 to-[#32128F]/30 rounded-full filter blur-[170px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-block text-xs font-mono font-bold uppercase tracking-widest text-[#08B8F0] mb-4"
        >
          DEPLOY IN MINUTES
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-white leading-[0.95] mb-6"
        >
          READY TO <span className="gradient-text font-black">AUTOMATE?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed mb-10 font-normal"
        >
          Start building autonomous AI workers today or explore career opportunities with leading engineering teams.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          <MagneticButton>
            <Button variant="primary" size="lg" as={Link} to="/register">
              Get Started
            </Button>
          </MagneticButton>

          <MagneticButton>
            <Button variant="secondary" size="lg" as={Link} to="/jobs">
              Browse Jobs
            </Button>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}

