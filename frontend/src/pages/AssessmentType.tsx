import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import { Home, Users, ArrowLeft } from 'lucide-react'

export const AssessmentType: React.FC = () => {
  const { updateData } = useAssessment()
  const navigate = useNavigate()

  const handleSelect = (type: 'individual' | 'community') => {
    updateData({ assessmentType: type })
    navigate('/assessment/wizard')
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-slate-950 pointer-events-none opacity-50 z-0" />

      <div className="relative z-10 max-w-4xl w-full text-center space-y-12">
        <div className="space-y-4 animate-fadeInScale">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Choose Your Assessment Type</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Select whether the assessment is for an individual property or a larger community project.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center max-w-2xl mx-auto">
          {/* Individual Assessment Card */}
          <button
            type="button"
            onClick={() => handleSelect('individual')}
            className="flex-1 bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-8 md:p-10 text-left transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 group"
          >
            <div className="flex items-center justify-center text-cyan-400 bg-cyan-950/40 w-16 h-16 rounded-xl mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Home className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-3">Individual</h2>
            <p className="text-slate-400 text-center text-sm leading-relaxed">
              A personalized plan for a single home, apartment, building, or small plot.
            </p>
          </button>

          {/* Community Assessment Card */}
          <button
            type="button"
            onClick={() => handleSelect('community')}
            className="flex-1 bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-8 md:p-10 text-left transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 group"
          >
            <div className="flex items-center justify-center text-cyan-400 bg-cyan-950/40 w-16 h-16 rounded-xl mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Users className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-3">Community</h2>
            <p className="text-slate-400 text-center text-sm leading-relaxed">
              Assess a larger project for a village, neighborhood, school campus, or commercial block.
            </p>
          </button>
        </div>

        <div className="animate-fadeInScale pt-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-cyan-400 font-medium inline-flex items-center space-x-2 transition-colors"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            <span>Back to Consent</span>
          </button>
        </div>
      </div>
    </div>
  )
}
