import React from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '@/components/SectionHeading'
import GlassCard from '@/components/GlassCard'
import { Radio, Brain, Play, ShieldCheck, CheckCircle2, ChevronRight, ArrowDown } from 'lucide-react'

const steps = [
  {
    step: '01',
    name: 'TRIGGER',
    icon: Radio,
    title: 'Event Detection',
    desc: 'Listens for API webhooks, schedule timers, or data pipeline events.',
    color: '#08B8F0',
  },
  {
    step: '02',
    name: 'REASON',
    icon: Brain,
    title: 'AI Analysis',
    desc: 'Interprets context, checks policies, and formulates step-by-step logic.',
    color: '#0877E8',
  },
  {
    step: '03',
    name: 'EXECUTE',
    icon: Play,
    title: 'Autonomous Action',
    desc: 'Runs tasks across enterprise systems, APIs, and microservices.',
    color: '#1239C7',
  },
  {
    step: '04',
    name: 'VERIFY',
    icon: ShieldCheck,
    title: 'Safety Check',
    desc: 'Validates outputs against compliance rules and error thresholds.',
    color: '#6D3BFF',
  },
  {
    step: '05',
    name: 'COMPLETE',
    icon: CheckCircle2,
    title: 'Handoff & Report',
    desc: 'Logs telemetry, sends summaries, and triggers downstream events.',
    color: '#10B981',
  },
]

export default function Workflow() {
  return (
    <section id="workflow" className="relative py-24 sm:py-32 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <SectionHeading
        eyebrow="EXECUTION PIPELINE"
        title="YOU DEFINE THE GOAL. AI DOES THE WORK."
        gradientWord="AI DOES THE WORK"
        description="A transparent 5-phase pipeline that transforms high-level business objectives into verified, deterministic automated execution."
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="relative"
              >
                <GlassCard className="h-full p-6 flex flex-col justify-between hover:border-white/30 transition-colors group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold tracking-widest text-white/40">
                        {item.name}
                      </span>
                      <span className="text-lg font-extrabold font-mono text-[#08B8F0]">
                        {item.step}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:bg-[#08B8F0]/20 group-hover:text-[#08B8F0] transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="text-base font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/8 flex items-center justify-between text-[10px] font-mono text-white/35">
                    <span>PHASE {item.step}</span>
                    {idx < steps.length - 1 && (
                      <>
                        <ChevronRight className="hidden md:block w-4 h-4 text-[#08B8F0]" />
                        <ArrowDown className="block md:hidden w-4 h-4 text-[#08B8F0]" />
                      </>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

