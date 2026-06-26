import React, { useState } from 'react'
import { subsidyData, type Scheme } from '../data/subsidyData'
import { CheckCircle2, AlertCircle, ExternalLink, HelpCircle, Landmark } from 'lucide-react'

export const SubsidyChecker: React.FC = () => {
  const states = Object.keys(subsidyData).filter((k) => k !== 'National').sort()

  // Form states
  const [selectedState, setSelectedState] = useState('')
  const [locationType, setLocationType] = useState<'urban' | 'rural'>('urban')
  const [plotSize, setPlotSize] = useState('')
  const [buildingType, setBuildingType] = useState<string>('residential')
  const [beneficiaryCategory, setBeneficiaryCategory] = useState('general')

  // Result states
  const [checked, setChecked] = useState(false)
  const [complianceStatus, setComplianceStatus] = useState<'Mandatory' | 'Optional'>('Optional')
  const [eligibleSchemes, setEligibleSchemes] = useState<Scheme[]>([])

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault()

    const size = parseFloat(plotSize) || 0
    let compliance: 'Mandatory' | 'Optional' = 'Optional'
    const list: Scheme[] = []

    // 1. Filter National Schemes
    const national = subsidyData['National']
    if (national && national.schemes) {
      national.schemes.forEach((scheme) => {
        const ec = scheme.eligibility
        if (
          ec.location.includes(locationType) &&
          (ec.building_type.length === 0 || ec.building_type.includes(buildingType)) &&
          (ec.beneficiary_category.length === 0 || ec.beneficiary_category.includes(beneficiaryCategory))
        ) {
          list.push(scheme)
        }
      })
    }

    // 2. Filter State-Specific rules & schemes
    const stateInfo = subsidyData[selectedState]
    if (stateInfo) {
      if (stateInfo.rules) {
        const rules = stateInfo.rules
        const sizeMin = rules.plot_size_min || 0
        const locations = rules.location || []

        if (rules.mandatory && locations.includes(locationType) && size >= sizeMin) {
          compliance = 'Mandatory'
        }
      }

      if (stateInfo.schemes) {
        stateInfo.schemes.forEach((scheme) => {
          const ec = scheme.eligibility
          if (
            ec.location.includes(locationType) &&
            (ec.building_type.length === 0 || ec.building_type.includes(buildingType)) &&
            (ec.beneficiary_category.length === 0 || ec.beneficiary_category.includes(beneficiaryCategory))
          ) {
            list.push(scheme)
          }
        })
      }
    }

    setComplianceStatus(compliance)
    setEligibleSchemes(list)
    setChecked(true)
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeInScale">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-white flex items-center justify-center space-x-2">
          <Landmark className="h-8 w-8 text-cyan-400" />
          <span>Government Subsidy & Policy Checker</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Find financial grants, direct subsidies, and state regulations matching your property type and location.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Questionnaire Form */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleCheck} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Select State</label>
              <select
                required
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-sm"
              >
                <option value="">-- Choose State --</option>
                {states.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Location Type</label>
              <div className="flex space-x-4">
                {['urban', 'rural'].map((t) => (
                  <label key={t} className="flex items-center space-x-2 text-sm text-slate-300 capitalize cursor-pointer">
                    <input
                      type="radio"
                      name="locationType"
                      value={t}
                      checked={locationType === t}
                      onChange={() => setLocationType(t as any)}
                      className="h-4 w-4 bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Plot Size (sq meters)</label>
              <input
                type="number"
                required
                min="0"
                value={plotSize}
                onChange={(e) => setPlotSize(e.target.value)}
                placeholder="e.g., 250"
                className="w-full bg-slate-950/60 border border-slate-800 text-white placeholder-slate-600 rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Building/Property Type</label>
              <div className="flex flex-wrap gap-4">
                {['residential', 'commercial', 'institutional', 'government'].map((t) => (
                  <label key={t} className="flex items-center space-x-2 text-sm text-slate-300 capitalize cursor-pointer">
                    <input
                      type="radio"
                      name="buildingType"
                      value={t}
                      checked={buildingType === t}
                      onChange={() => setBuildingType(t)}
                      className="h-4 w-4 bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Beneficiary Category</label>
              <select
                value={beneficiaryCategory}
                onChange={(e) => setBeneficiaryCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-sm"
              >
                <option value="general">General Citizen</option>
                <option value="bpl">Below Poverty Line (BPL)</option>
                <option value="sc_st">SC / ST</option>
                <option value="women_shg">Women Self-Help Group (SHG)</option>
                <option value="farmer">Farmer / Cultivator</option>
                <option value="community">Community / Neighborhood Group</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
            >
              Check Policy Eligibility
            </button>
          </form>
        </div>

        {/* Results output section */}
        <div className="space-y-6">
          {checked ? (
            <div className="space-y-6 animate-fadeInScale">
              {/* Compliance Box */}
              <div className={`p-6 border rounded-xl space-y-2 ${
                complianceStatus === 'Mandatory'
                  ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
                  : 'bg-slate-950/40 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center space-x-2 text-md font-bold">
                  {complianceStatus === 'Mandatory' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <HelpCircle className="h-5 w-5 text-cyan-400" />
                  )}
                  <span>RWH mandate: {complianceStatus}</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-400">
                  {complianceStatus === 'Mandatory'
                    ? `rainwater harvesting is legally required in ${selectedState} for plot sizes of this capacity.`
                    : `Installation is voluntary and encouraged in ${selectedState} for your building specification.`}
                </p>
              </div>

              {/* Matching Schemes */}
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-4">
                <h3 className="text-lg font-bold text-white">Eligible Subsidy Schemes</h3>
                {eligibleSchemes.length > 0 ? (
                  <div className="space-y-4">
                    {eligibleSchemes.map((scheme, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white text-sm">{scheme.name}</span>
                          <span className="bg-slate-900 border border-slate-800 text-cyan-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            {scheme.scope}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{scheme.description}</p>
                        <div className="text-xs pt-1">
                          <strong className="text-slate-400">Estimated Subsidy:</strong>{' '}
                          <span className="text-cyan-400 font-semibold">{scheme.subsidy_details}</span>
                        </div>
                        {scheme.link && scheme.link.startsWith('http') ? (
                          <a
                            href={scheme.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-cyan-400 hover:underline flex items-center space-x-1 pt-1"
                          >
                            <span>Official Scheme link</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : scheme.link ? (
                          <span className="text-[10px] text-slate-500 italic">({scheme.link})</span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 leading-relaxed text-center py-6">
                    No specific state-level subsidy schemes matched your criteria. However, national campaigns like Jal Shakti Abhiyan may still offer indirect support through municipal bodies.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl p-12 text-slate-500 text-center">
              <AlertCircle className="h-10 w-10 text-slate-600 mb-2" />
              <p className="text-xs max-w-xs">
                Select your state, building dimensions, and demographics, then check to display matching subsidy schemes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
