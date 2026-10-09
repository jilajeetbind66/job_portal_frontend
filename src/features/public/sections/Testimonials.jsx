import React from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '@/components/SectionHeading'
import GlassCard from '@/components/GlassCard'
import { Quote, Star } from 'lucide-react'

const testimonials = [
  {
    quote: "VECOR AI transformed our operational pipeline. Our engineering team reclaimed 35 hours per week previously spent on manual data verification.",
    author: "Elena Rostova",
    role: "VP of Engineering",
    company: "Hyperion Infrastructure",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  },
  {
    quote: "The deterministic reliability of VECOR AI workers is unmatched. Zero downtime, flawless error recovery, and seamless API integrations.",
    author: "Marcus Chen",
    role: "Chief Technology Officer",
    company: "Synapse Financial",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
  },
]

export default function Testimonials() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-8 lg:px-16 overflow-hidden bg-white/[0.01] border-y border-white/8">
      <SectionHeading
        eyebrow="ENGINEERING TRUST"
        title="WHAT LEADERS SAY ABOUT VECOR."
        gradientWord="WHAT LEADERS SAY"
        description="Hear how forward-thinking technology teams scale their throughput using autonomous AI workers."
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((item, idx) => (
          <motion.div
            key={item.author}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: idx * 0.15 }}
          >
            <GlassCard className="p-8 sm:p-10 flex flex-col justify-between h-full relative overflow-hidden group">
              <Quote className="w-12 h-12 text-[#08B8F0]/20 absolute top-6 right-6 group-hover:text-[#08B8F0]/40 transition-colors" />

              <div className="relative z-10 mb-8">
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-base sm:text-lg text-white/85 leading-relaxed italic font-normal">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 relative z-10 pt-6 border-t border-white/10">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-12 h-12 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{item.author}</h4>
                  <p className="text-xs text-white/50">{item.role} · <span className="text-[#08B8F0]">{item.company}</span></p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

