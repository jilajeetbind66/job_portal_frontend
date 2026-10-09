import React from 'react'
import { motion } from 'framer-motion'
import GlassCard from '@/components/GlassCard'

const stats = [
  { value: '99.9%', label: 'AUTOMATION RELIABILITY', desc: 'Deterministic SLA performance guarantee' },
  { value: '42K+', label: 'TASKS COMPLETED DAILY', desc: 'Across high-throughput pipeline clusters' },
  { value: '24/7', label: 'AUTONOMOUS OPERATIONS', desc: 'Zero human intervention required' },
  { value: '10x', label: 'FASTER EXECUTION', desc: 'Compared to traditional manual workflows' },
]

export default function Stats() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-[#32128F]/20 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <GlassCard className="p-8 text-center flex flex-col justify-between h-full hover:border-[#08B8F0]/30 transition-all duration-300">
                <div className="mb-4">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-mono gradient-text">
                    {item.value}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold tracking-widest text-white/90 uppercase mb-2">
                    {item.label}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

