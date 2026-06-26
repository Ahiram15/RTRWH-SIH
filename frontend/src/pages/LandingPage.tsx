import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import { ShieldCheck, CheckCircle2, User, KeyRound } from 'lucide-react'
import logoImg from '../assets/logo.png'

export const LandingPage: React.FC = () => {
  const { data, updateData } = useAssessment()
  const navigate = useNavigate()

  const [step, setStep] = useState<'login' | 'consent'>('login')
  const [consent1, setConsent1] = useState(data.consentGiven)
  const [consent2, setConsent2] = useState(false)
  const [consent3, setConsent3] = useState(false)

  const handleStart = () => {
    setStep('consent')
  }

  const handleProceed = () => {
    if (consent1 && consent3) {
      updateData({ consentGiven: true })
      navigate('/assessment')
    } else {
      alert('Please check the required consent boxes to proceed.')
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Particles Grid */}
      <div className="absolute inset-0 bg-slate-950 pointer-events-none opacity-50 z-0" />

      <div className="relative z-10 max-w-4xl w-full">
        {/* Title branding */}
        <div className="flex flex-col items-center text-center mb-10 animate-fadeInScale">
          <img src={logoImg} alt="Hydro Harvest Logo" className="h-20 w-20 object-contain mb-4 rounded-2xl shadow-xl shadow-cyan-900/30 border border-slate-800" />
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter drop-shadow-md">
            <span className="text-cyan-400">HYDRO</span> HARVEST
          </h1>
          <p className="mt-3 text-lg text-slate-300 drop-shadow">
            Your Solution for Sustainable Water Management
          </p>
        </div>

        {step === 'login' ? (
          /* Login Section */
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Join the Water <span className="text-cyan-400">Revolution</span>
              </h2>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                Discover the potential of rainwater harvesting at your location. Start your journey towards sustainable water management and contribute to groundwater conservation.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400">500M+</div>
                  <div className="text-xs text-slate-400">Liters Saved</div>
                </div>
                <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400">10K+</div>
                  <div className="text-xs text-slate-400">Happy Users</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-8 max-w-md w-full mx-auto shadow-2xl space-y-6">
              <h3 className="text-xl font-bold text-white text-center">Get Started</h3>
              
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleStart}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg hover:shadow-cyan-500/20 transition-all"
                >
                  <User className="h-5 w-5" />
                  <span>Continue as Guest / Start Assessment</span>
                </button>

                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="px-3 text-slate-500 text-xs">ADMINISTRATION</span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <a
                  href="/admin_login"
                  className="w-full border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors"
                >
                  <KeyRound className="h-5 w-5 text-cyan-400" />
                  <span>Admin Panel Login</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Consent Section */
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-8 lg:p-12 text-center shadow-2xl max-w-2xl mx-auto space-y-8 animate-fadeInScale">
            <div className="flex flex-col items-center space-y-4">
              <img src={logoImg} alt="Logo" className="h-16 w-16 object-contain animate-bounce rounded-2xl border border-slate-800" />
              <h2 className="text-3xl font-bold text-white">
                Water Conservation Starts with <span className="text-cyan-400">You</span>
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                Every drop counts in our mission to preserve water for future generations. Learn how rainwater harvesting can transform your property into a water-positive asset.
              </p>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl">
                <CheckCircle2 className="h-5 w-5 text-cyan-400 mb-2" />
                <h4 className="font-semibold text-white text-xs mb-1">Eco Impact</h4>
                <p className="text-[11px] text-slate-400">Reduce groundwater depletion and support ecosystems.</p>
              </div>
              <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl">
                <CheckCircle2 className="h-5 w-5 text-cyan-400 mb-2" />
                <h4 className="font-semibold text-white text-xs mb-1">Cost Savings</h4>
                <p className="text-[11px] text-slate-400">Save money on tankers and utility water bills.</p>
              </div>
              <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl">
                <CheckCircle2 className="h-5 w-5 text-cyan-400 mb-2" />
                <h4 className="font-semibold text-white text-xs mb-1">Sustainability</h4>
                <p className="text-[11px] text-slate-400">Secure property values with reliable infrastructure.</p>
              </div>
            </div>

            {/* Consent Form checkboxes */}
            <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-xl text-left space-y-4">
              <h3 className="text-md font-semibold text-white flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
                <span>Your Consent</span>
              </h3>

              <div className="space-y-3 text-xs md:text-sm text-slate-300">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent1}
                    onChange={(e) => setConsent1(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>I consent to the collection and processing of my location data to provide personalized rainwater harvesting assessments (Required)</span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent2}
                    onChange={(e) => setConsent2(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>I agree to receive updates and recommendations about water conservation initiatives (Optional)</span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent3}
                    onChange={(e) => setConsent3(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>I have read and agree to the Terms of Service and Privacy Policy (Required)</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="w-full sm:w-auto border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 px-6 py-3 rounded-xl font-medium"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleProceed}
                disabled={!consent1 || !consent3}
                className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                  consent1 && consent3
                    ? 'bg-cyan-500 hover:bg-cyan-600 text-slate-950 hover:shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                Start My Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
