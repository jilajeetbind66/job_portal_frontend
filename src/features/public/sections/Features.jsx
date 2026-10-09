import React from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '@/components/SectionHeading'
import GlassCard from '@/components/GlassCard'
import { Bot, Zap, ArrowRight, BrainCircuit } from 'lucide-react'

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#0877E8]/10 rounded-full filter blur-[140px] pointer-events-none" />

      <SectionHeading
        eyebrow="ENTERPRISE CAPABILITIES"
        title="AI THAT ACTUALLY WORKS."
        gradientWord="ACTUALLY WORKS"
        description="Purpose-built autonomous infrastructure designed for production environments where reliability, precision, and performance are non-negotiable."
      />

      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Feature 01 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <GlassCard className="lg:col-span-7 h-[380px] sm:h-[450px] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#08B8F0]/10 via-transparent to-[#32128F]/20 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex justify-between items-start">
              <span className="text-xs font-mono text-[#08B8F0] px-3 py-1 rounded-full bg-[#08B8F0]/10 border border-[#08B8F0]/20">
                MODULE // 01
              </span>
              <Bot className="w-8 h-8 text-white/40 group-hover:text-[#08B8F0] transition-colors" />
            </div>

            <div className="relative z-10 my-auto p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Autonomous Worker #089
                </span>
                <span className="font-mono text-[#08B8F0]">EXECUTING</span>
              </div>
              <p className="text-sm font-semibold text-white font-mono">
                &gt; Orchestrating multi-tier database migration &amp; API validation...
              </p>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#08B8F0] to-[#0877E8] h-full w-[84%] rounded-full animate-pulse" />
              </div>
            </div>

            <div className="relative z-10 flex justify-between items-center text-xs text-white/45">
              <span>ORCHESTRATION ENGINE</span>
              <span>100% DETERMINISTIC</span>
            </div>
          </GlassCard>

          <div className="lg:col-span-5 space-y-4 lg:pl-6">
            <span className="text-4xl font-extrabold text-[#08B8F0] font-mono">01</span>
            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              AUTONOMOUS AI WORKERS
            </h3>
            <p className="text-white/65 text-base sm:text-lg leading-relaxed font-normal">
              Not just chatbots. Fully autonomous agents that understand context, execute multi-step logic, handle edge cases, and report back with zero human intervention.
            </p>
          </div>
        </motion.div>

        {/* Feature 02 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-5 space-y-4 lg:pr-6 order-2 lg:order-1">
            <span className="text-4xl font-extrabold text-[#0877E8] font-mono">02</span>
            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              DEEP WORKFLOW AUTOMATION
            </h3>
            <p className="text-white/65 text-base sm:text-lg leading-relaxed font-normal">
              Connect AI workers directly into your existing APIs, databases, and enterprise stack. Trigger automated routines via webhooks, schedules, or event streams.
            </p>
          </div>

          <GlassCard className="lg:col-span-7 h-[380px] sm:h-[450px] flex flex-col justify-between relative overflow-hidden group order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0877E8]/15 via-transparent to-[#08B8F0]/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex justify-between items-start">
              <span className="text-xs font-mono text-[#0877E8] px-3 py-1 rounded-full bg-[#0877E8]/10 border border-[#0877E8]/20">
                MODULE // 02
              </span>
              <Zap className="w-8 h-8 text-white/40 group-hover:text-[#0877E8] transition-colors" />
            </div>

            <div className="relative z-10 my-auto grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-white/40 font-mono">TRIGGER</p>
                <p className="text-xs font-bold text-white mt-1">Webhook Event</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
                <p className="text-[10px] text-[#08B8F0] font-mono">PROCESSING</p>
                <p className="text-xs font-bold text-white mt-1">AI Reasoning</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                <p className="text-[10px] text-emerald-400 font-mono">OUTPUT</p>
                <p className="text-xs font-bold text-white mt-1">Database Commit</p>
              </div>
            </div>

            <div className="relative z-10 flex justify-between items-center text-xs text-white/45">
              <span>ZERO-LATENCY STREAMING</span>
              <span>AES-256 ENCRYPTED</span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Feature 03 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassCard className="p-8 sm:p-12 relative overflow-hidden group">
            <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-[#32128F]/30 rounded-full filter blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-3">
                <span className="text-4xl font-extrabold text-[#6D3BFF] font-mono">03</span>
                <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  SELF-HEALING ADAPTIVE INTELLIGENCE
                </h3>
                <p className="text-white/65 text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
                  When APIs change or unexpected formats arrive, VECOR AI workers dynamically adapt, verify compliance, and self-correct routines without breaking your pipeline.
                </p>
              </div>
              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <BrainCircuit className="w-32 h-32 text-white/10 group-hover:text-[#08B8F0]/30 transition-colors duration-500" />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}

