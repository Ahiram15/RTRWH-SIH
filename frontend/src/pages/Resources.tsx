import React, { useState } from 'react'
import { BookOpen, Video, HelpCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react'

export const Resources: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'articles' | 'videos' | 'faqs'>('articles')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const articles = [
    {
      title: 'Introduction to Rooftop Rainwater Harvesting',
      description: 'Learn the basic concepts of capturing rainwater, including catchments, conduits, filtration, and storage systems.',
      readTime: '5 min read',
      category: 'Basics'
    },
    {
      title: 'Understanding Groundwater Recharge Safety',
      description: 'Why checking groundwater depth, soil infiltration rates, and aquifer types is critical before implementing artificial recharge.',
      readTime: '8 min read',
      category: 'Hydrogeology'
    },
    {
      title: 'Maintenance Guide for Silt Traps and Filters',
      description: 'Step-by-step instructions on cleaning sand-gravel-boulder filters, first flush diverters, and maintaining water quality.',
      readTime: '6 min read',
      category: 'Maintenance'
    }
  ]

  const videos = [
    {
      title: 'How to Build a Rainwater Harvesting System',
      duration: '12:45',
      embedId: 'dQw4w9WgXcQ', // Placeholder or sample video
      description: 'A visual walkthrough showing piping, tank placement, and filter installation.'
    },
    {
      title: 'Groundwater Recharge Methods Explained',
      duration: '8:30',
      embedId: 'dQw4w9WgXcQ',
      description: 'Explaining recharge pits, trenches, shafts, and how they replenish local aquifers.'
    }
  ]

  const faqs = [
    {
      q: 'How much rainwater can I collect from my roof?',
      a: 'The general formula is: Area (in sq meters) × Annual Rainfall (in mm) × Runoff Coefficient (typically 0.75 to 0.9 depending on roof material). For example, a 100 sq meter concrete roof in a region with 1,000 mm of annual rainfall can yield about 75,000 to 85,000 liters of water annually.'
    },
    {
      q: 'Is harvested rainwater safe for drinking?',
      a: 'Rainwater collected from clean roofs is generally safe for non-potable uses (washing, toilet flushing, gardening). If intended for drinking or cooking, it must pass through proper filtration (sand-gravel filters, carbon filters) followed by disinfection (UV filter, chlorination, or boiling) to eliminate pathogens.'
    },
    {
      q: 'What is a first flush diverter and why is it needed?',
      a: 'A first flush diverter is a valve or pipe chamber that diverts the first few minutes of rain runoff away from the storage tank. This first runoff contains the highest concentration of roof dirt, leaves, bird droppings, and atmospheric pollutants accumulated during dry spells.'
    },
    {
      q: 'How often should RWH filters be cleaned?',
      a: 'First flush devices should be cleaned after every heavy rain spell. Sand-gravel physical filters should be backwashed or have their top sand layer cleaned/replaced once before the monsoon starts and once during the season depending on usage.'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeInScale">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-white flex items-center justify-center space-x-2">
          <BookOpen className="h-8 w-8 text-cyan-400" />
          <span>Knowledge & Resource Center</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Articles, video tutorials, and guides to help you implement sustainable water conservation systems.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-850 justify-center space-x-4">
        {[
          { id: 'articles', label: 'Articles & Guides', icon: FileText },
          { id: 'videos', label: 'Video Tutorials', icon: Video },
          { id: 'faqs', label: 'Frequently Asked Questions', icon: HelpCircle }
        ].map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3.5 border-b-2 text-sm font-semibold transition-all ${
                active
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content Cards */}
      <div className="space-y-6">
        
        {/* Articles tab */}
        {activeTab === 'articles' && (
          <div className="grid gap-6 animate-fadeInScale">
            {articles.map((art, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-cyan-950/40 text-cyan-400 px-2.5 py-1 rounded-full font-bold border border-cyan-800/40">
                    {art.category}
                  </span>
                  <span className="text-slate-500">{art.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-white hover:text-cyan-400 transition-colors cursor-pointer">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{art.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Videos tab */}
        {activeTab === 'videos' && (
          <div className="grid md:grid-cols-2 gap-6 animate-fadeInScale">
            {videos.map((vid, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
                {/* Embed video frame */}
                <div className="aspect-video w-full bg-slate-950 flex items-center justify-center text-slate-600 text-xs">
                  <Video className="h-8 w-8 text-slate-700 mr-2" />
                  <span>Video Tutorial Embed Placeholder</span>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{vid.title}</span>
                    <span className="text-slate-500">{vid.duration}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{vid.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FAQs tab */}
        {activeTab === 'faqs' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-4 animate-fadeInScale">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div key={idx} className="border-b border-slate-850 last:border-0 pb-4 last:pb-0">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-white text-sm hover:text-cyan-400 transition-colors py-2"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="h-4.5 w-4.5 text-cyan-400" /> : <ChevronDown className="h-4.5 w-4.5 text-slate-500" />}
                  </button>
                  {isOpen && (
                    <div className="mt-2 text-xs text-slate-400 leading-relaxed pl-2 border-l border-cyan-500/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
