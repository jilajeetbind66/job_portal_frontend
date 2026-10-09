import React from 'react'
import { motion } from 'framer-motion'
import Marquee from '@/components/Marquee'
import { Cpu, ShieldCheck, Zap, Layers, Globe, Server, Database, Cloud } from 'lucide-react'

const partners = [
  { name: 'NEXUS ENTERPRISE', icon: Cpu },
  { name: 'SYNAPSE CAPITAL', icon: ShieldCheck },
  { name: 'HYPERION LABS', icon: Zap },
  { name: 'QUANTUM DYNAMICS', icon: Layers },
  { name: 'GLOBAL CLOUD SEC', icon: Globe },
  { name: 'AETHER NETWORKS', icon: Server },
  { name: 'DATAFLOW INC', icon: Database },
  { name: 'ORBITAL SYSTEMS', icon: Cloud },
]

export default function TrustedBy() {
  return (
    <section className="relative py-12 border-y border-white/8 bg-white/[0.01] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center mb-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs font-semibold uppercase tracking-widest text-white/45"
        >
          POWERING MODERN TEAMS WORLDWIDE
        </motion.p>
      </div>

      <Marquee speed={35} className="py-2">
        {partners.map((partner, idx) => {
          const Icon = partner.icon
          return (
            <div
              key={idx}
              className="flex items-center gap-3 text-white/50 hover:text-white/90 transition-colors duration-300 cursor-pointer group px-4"
            >
              <Icon className="w-5 h-5 text-[#08B8F0] opacity-60 group-hover:opacity-100 transition-opacity" />
              <span className="text-sm font-semibold tracking-wider font-sans">
                {partner.name}
              </span>
            </div>
          )
        })}
      </Marquee>
    </section>
  )
}

