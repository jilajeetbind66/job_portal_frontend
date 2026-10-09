import React from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '@/components/SectionHeading'
import GlassCard from '@/components/GlassCard'
import { Cpu, CheckCircle2, Shield, Activity, Terminal } from 'lucide-react'

const workerNodes = [
  { id: 'W-01', title: 'Data Processing Unit', status: 'ACTIVE', load: '14%' },
  { id: 'W-02', title: 'API Integration Agent', status: 'ACTIVE', load: '32%' },
  { id: 'W-03', title: 'Compliance Verifier', status: 'VERIFYING', load: '89%' },
  { id: 'W-04', title: 'Security Sentinel', status: 'ACTIVE', load: '04%' },
]

export default function AIWorkers() {
  return (
    <section id="ai-workers" className="relative py-24 sm:py-32 px-4 sm:px-8 lg:px-16 overflow-hidden bg-white/[0.01] border-y border-white/8">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#08B8F0]/10 rounded-full filter blur-[160px] pointer-events-none" />

      <SectionHeading
        eyebrow="AUTONOMOUS ORCHESTRATION"
        title="LET AI HANDLE THE REPETITIVE WORK."
        gradientWord="REPETITIVE WORK"
        description="Shift your engineering workforce from routine maintenance to high-impact innovation while AI workers execute background operations continuously."
      />

      <div className="max-w-7xl mx-auto">
        <GlassCard className="p-8 sm:p-14 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-[#08B8F0]/15 border border-[#08B8F0]/30 text-[#08B8F0]">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Live Operations Grid</h3>
                  <p className="text-xs text-white/50">4 Autonomous Clusters Online</p>
                </div>
              </div>

              {workerNodes.map((node, idx) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#08B8F0]/30 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <p className="text-xs font-mono text-white/40">{node.id}</p>
                      <p className="text-sm font-semibold text-white group-hover:text-[#08B8F0] transition-colors">
                        {node.title}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {node.status}
                    </span>
                    <p className="text-[11px] text-white/40 font-mono mt-1">
                      LOAD: {node.load}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-7 relative flex items-center justify-center min-h-[350px]">
              <div className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full border border-dashed border-white/15 animate-spin-slow pointer-events-none" />
              <div className="absolute w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] rounded-full border border-white/10 pointer-events-none" />

              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-[#08B8F0] via-[#0877E8] to-[#32128F] p-1 shadow-[0_0_60px_rgba(8,184,240,0.5)] flex items-center justify-center text-white"
              >
                <div className="w-full h-full rounded-full bg-[#05070D]/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-3">
                  <Cpu className="w-8 h-8 text-[#08B8F0] mb-1 animate-pulse" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white/70">
                    CORE AI
                  </span>
                  <span className="text-xs font-mono font-extrabold text-[#08B8F0]">
                    v4.8 ACTIVE
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

