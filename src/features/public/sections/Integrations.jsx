import React from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '@/components/SectionHeading'
import GlassCard from '@/components/GlassCard'
import { Database, MessageSquare, Mail, Calendar, Webhook, BarChart3, Code2, Globe } from 'lucide-react'

const integrations = [
  { name: 'ENTERPRISE CRM', category: 'Sales & Data', icon: Database },
  { name: 'SLACK & TEAMS', category: 'Messaging', icon: MessageSquare },
  { name: 'EMAIL GATEWAYS', category: 'Communications', icon: Mail },
  { name: 'CALENDAR ENGINES', category: 'Scheduling', icon: Calendar },
  { name: 'REST & GRAPHQL APIS', category: 'Protocol', icon: Code2 },
  { name: 'REALTIME WEBHOOKS', category: 'Events', icon: Webhook },
  { name: 'ANALYTICS PIPELINES', category: 'Telemetry', icon: BarChart3 },
  { name: 'CLOUD DATABASES', category: 'Storage', icon: Globe },
]

export default function Integrations() {
  return (
    <section id="integrations" className="relative py-24 sm:py-32 px-4 sm:px-8 lg:px-16 overflow-hidden bg-white/[0.01] border-y border-white/8">
      <SectionHeading
        eyebrow="UNIVERSAL CONNECTIVITY"
        title="CONNECTS TO YOUR WORKFLOW."
        gradientWord="YOUR WORKFLOW"
        description="Plug VECOR AI directly into your existing enterprise stack with zero custom glue code or infrastructure overhauls."
      />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {integrations.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
              >
                <GlassCard className="p-6 flex flex-col items-start gap-4 hover:border-[#08B8F0]/40 transition-all duration-300 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#08B8F0] group-hover:bg-[#08B8F0] group-hover:text-black transition-all duration-300 shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#08B8F0] transition-colors">
                      {item.name}
                    </h3>
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

