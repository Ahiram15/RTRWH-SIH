import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ChartComponent } from '../components/ChartComponent'
import { ResultsMapComponent } from '../components/ResultsMapComponent'
import {
  Droplet,
  MapPin,
  Scale,
  DollarSign,
  Filter,
  FileDown,
  RefreshCw,
  Home,
  Waves,
  ShieldCheck,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'

export const ResultsDashboard: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const entryId = searchParams.get('entry_id')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'location' | 'structures' | 'cost' | 'purification'>('overview')

  const fetchResults = async () => {
    if (!entryId) {
      setError('Missing entry ID parameter.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/results/${entryId}`)
      const resJson = await response.json()
      if (response.ok) {
        setData(resJson)
      } else {
        setError(resJson.error || 'Failed to fetch assessment results.')
      }
    } catch (err) {
      console.error('Error fetching results:', err)
      setError('An error occurred while communicating with the server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResults()
  }, [entryId])

  const handleDownloadPDF = () => {
    if (entryId) {
      window.open(`/download_report/${entryId}?lang=en`, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-4 text-slate-400">
        <RefreshCw className="h-10 w-10 animate-spin text-cyan-400" />
        <span>Generating your water harvesting report...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-4 max-w-md mx-auto text-center px-4">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
        <h2 className="text-xl font-bold text-white">Assessment Error</h2>
        <p className="text-slate-400 text-sm leading-relaxed">{error}</p>
        <button
          type="button"
          onClick={() => navigate('/assessment/wizard')}
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition-colors"
        >
          Restart Assessment
        </button>
      </div>
    )
  }

  const { user_data, location_data, analysis } = data
  const categoryInfo = analysis.category

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeInScale">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
            <Droplet className="h-8 w-8 text-cyan-400 animate-pulse" />
            <span>Feasibility Report Dashboard</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Property: <strong className="text-white">{user_data.name}</strong> • Location: <strong className="text-white">{user_data.location_name}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadPDF}
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/10 transition-all hover:scale-103"
        >
          <FileDown className="h-5 w-5" />
          <span>Download PDF Summary</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-850 overflow-x-auto space-x-2 py-1 scrollbar-none">
        {[
          { id: 'overview', label: 'Feasibility Overview', icon: Scale },
          { id: 'location', label: 'Location & Geography', icon: MapPin },
          { id: 'structures', label: 'Sizing & Category', icon: Home },
          { id: 'cost', label: 'Financials & Savings', icon: DollarSign },
          { id: 'purification', label: 'Purification Flow', icon: Filter }
        ].map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-t-xl text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                active
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB CONTENT CARDS */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
        
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-8 items-start animate-fadeInScale">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Feasibility Assessment</h2>
                <p className="text-slate-400 text-xs">
                  A comparison of water harvested from your roof compared against your household demand.
                </p>
              </div>

              <div className="bg-slate-950/50 border border-slate-850 p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold text-sm">Feasibility Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    analysis.feasibility_status.includes('Fully')
                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950/40 text-amber-400 border border-amber-800'
                  }`}>
                    {analysis.feasibility_status}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-900 pt-4">
                  <span className="text-slate-400 font-semibold text-sm">Potential Match Rate:</span>
                  <span className="text-2xl font-black text-cyan-400">{analysis.feasibility_percentage}%</span>
                </div>
              </div>

              <div className="bg-slate-950/20 border border-slate-850 p-5 rounded-xl space-y-3">
                <h3 className="text-md font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-cyan-400" />
                  <span>Artificial Recharge Safety Check</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Is it safe to inject water back into the ground at this location?
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${analysis.safety_check.is_safe ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="text-sm font-semibold text-white">
                    {analysis.safety_check.is_safe ? 'Recharge is Safe' : 'Recharge Restricted / Unsafe'}
                  </span>
                </div>
                {analysis.safety_check.safety_issues && analysis.safety_check.safety_issues.length > 0 && (
                  <ul className="list-disc list-inside text-rose-400 text-xs space-y-1 mt-2 pl-2">
                    {analysis.safety_check.safety_issues.map((issue: string, idx: number) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <ChartComponent
                supplyLiters={analysis.harvesting_potential.annual_liters}
                demandLiters={analysis.annual_demand}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Location & Geography */}
        {activeTab === 'location' && (
          <div className="grid md:grid-cols-2 gap-8 items-start animate-fadeInScale">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <MapPin className="h-6 w-6 text-cyan-400" />
                <span>Geographic Statistics</span>
              </h2>

              <div className="bg-slate-950/50 border border-slate-850 p-6 rounded-xl divide-y divide-slate-900">
                <div className="py-3 flex justify-between text-sm">
                  <span className="text-slate-400">Nearest Groundwater Station:</span>
                  <span className="text-white font-semibold">{location_data.Region_Name}</span>
                </div>
                <div className="py-3 flex justify-between text-sm">
                  <span className="text-slate-400">State / Territory:</span>
                  <span className="text-white font-semibold">{location_data.State}</span>
                </div>
                <div className="py-3 flex justify-between text-sm">
                  <span className="text-slate-400">Average Annual Rainfall:</span>
                  <span className="text-cyan-400 font-bold">{location_data.Rainfall_mm.toFixed(1)} mm</span>
                </div>
                <div className="py-3 flex justify-between text-sm">
                  <span className="text-slate-400">Groundwater Level (Depth):</span>
                  <span className="text-white font-semibold">{location_data.Groundwater_Depth_m.toFixed(1)} m</span>
                </div>
                <div className="py-3 flex justify-between text-sm">
                  <span className="text-slate-400">Soil Type Classification:</span>
                  <span className="text-white font-semibold">{location_data.Soil_Type}</span>
                </div>
                <div className="py-3 flex justify-between text-sm">
                  <span className="text-slate-400">Infiltration Rate:</span>
                  <span className="text-white font-semibold">{location_data.Infiltration_Rate_mm_per_hr} mm/hr</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {user_data.user_lat && user_data.user_lon && location_data.Latitude && location_data.Longitude && (
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-cyan-400" />
                    <span>Interactive Location Mapping</span>
                  </h2>
                  <ResultsMapComponent
                    userLat={user_data.user_lat}
                    userLng={user_data.user_lon}
                    userAddress={user_data.location_name || 'Your Location'}
                    stationLat={location_data.Latitude}
                    stationLng={location_data.Longitude}
                    stationName={location_data.Region_Name}
                    stationDetails={{
                      state: location_data.State,
                      rainfall: location_data.Rainfall_mm,
                      soilType: location_data.Soil_Type,
                      depth: location_data.Groundwater_Depth_m,
                      infiltration: location_data.Infiltration_Rate_mm_per_hr,
                      aquifer: location_data.Aquifer_Type || 'Unconfined',
                    }}
                  />
                </div>
              )}

              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <Waves className="h-6 w-6 text-cyan-400" />
                <span>Hydrogeology Details</span>
              </h2>

              <div className="bg-slate-950/50 border border-slate-850 p-6 rounded-xl space-y-4">
                <div className="flex justify-between text-sm border-b border-slate-900 pb-3">
                  <span className="text-slate-400">Aquifer Type:</span>
                  <span className="text-white font-semibold">{location_data.Aquifer_Type || 'Unconfined'}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The local aquifer material and type define how groundwater transmits and flows. Recharging groundwater depends heavily on the specific yield and hydraulic conductivity of this region.
                </p>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                  <strong>Database Source Info:</strong> CGWB (Central Ground Water Board) district profiles and monitoring stations.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Sizing & Structures */}
        {activeTab === 'structures' && (
          <div className="grid md:grid-cols-2 gap-8 items-start animate-fadeInScale">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Recommended Harvesting Class</h2>
              <div className="bg-slate-950/50 border border-slate-850 p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-bold text-cyan-400">{categoryInfo.name}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{categoryInfo.description}</p>
                <div className="text-xs text-slate-400 border-t border-slate-900 pt-3 flex justify-between">
                  <span>Confidence Score:</span>
                  <span className="text-cyan-400 font-bold">{categoryInfo.confidence_score}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Structure & Size Sizing</h2>
              <div className="bg-slate-950/50 border border-slate-850 p-6 rounded-xl space-y-4">
                <div className="border-b border-slate-900 pb-3">
                  <h4 className="text-xs font-semibold text-slate-400 mb-1">Storage Tank Capacity</h4>
                  <span className="text-xl font-bold text-white">
                    {analysis.structure_dimensions.storage?.capacity_liters ? analysis.structure_dimensions.storage.capacity_liters.toLocaleString() : 'N/A'} Liters
                  </span>
                </div>

                {analysis.structure_dimensions.pit && (
                  <div className="border-b border-slate-900 pb-3">
                    <h4 className="text-xs font-semibold text-slate-400 mb-1">Recharge Pit Dimensions</h4>
                    <span className="text-sm font-semibold text-white">
                      {analysis.structure_dimensions.pit.length_m}m × {analysis.structure_dimensions.pit.width_m}m × {analysis.structure_dimensions.pit.depth_m}m (Vol: {analysis.structure_dimensions.pit.volume_m3}m³)
                    </span>
                  </div>
                )}

                {analysis.structure_dimensions.trench && (
                  <div className="border-b border-slate-900 pb-3">
                    <h4 className="text-xs font-semibold text-slate-400 mb-1">Recharge Trench Dimensions</h4>
                    <span className="text-sm font-semibold text-white">
                      {analysis.structure_dimensions.trench.length_m.toFixed(1)}m × {analysis.structure_dimensions.trench.width_m}m × {analysis.structure_dimensions.trench.depth_m}m (Vol: {analysis.structure_dimensions.trench.volume_m3.toFixed(1)}m³)
                    </span>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-semibold text-slate-400 mb-2">Recommended Infrastructure</h4>
                  <ul className="space-y-2">
                    {categoryInfo.recommended_structures.map((struct: string, idx: number) => (
                      <li key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        <span>{struct}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Financials & Costs */}
        {activeTab === 'cost' && (
          <div className="grid md:grid-cols-2 gap-8 items-start animate-fadeInScale">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <DollarSign className="h-6 w-6 text-cyan-400" />
                <span>Installation Cost Estimator</span>
              </h2>

              <div className="bg-slate-950/50 border border-slate-850 p-6 rounded-xl divide-y divide-slate-900">
                <div className="py-3 flex justify-between text-sm">
                  <span className="text-slate-400">Total Setup Cost:</span>
                  <span className="text-cyan-400 font-bold text-lg">₹{analysis.cost_analysis.total_cost.toLocaleString()}</span>
                </div>
                <div className="py-3 flex justify-between text-sm">
                  <span className="text-slate-400">Government Subsidy:</span>
                  <span className="text-emerald-400 font-semibold">₹{analysis.cost_analysis.subsidy_amount.toLocaleString()}</span>
                </div>
                <div className="py-3 flex justify-between text-sm">
                  <span className="text-slate-400">Net Investment Required:</span>
                  <span className="text-cyan-400 font-bold text-lg">₹{analysis.cost_analysis.net_investment.toLocaleString()}</span>
                </div>
              </div>

              {analysis.cost_analysis.component_breakdown && (
                <div className="bg-slate-950/30 border border-slate-850 p-6 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold text-white">Component Breakdown Estimates</h3>
                  <div className="space-y-2">
                    {Object.entries(analysis.cost_analysis.component_breakdown).map(([compName, compVal]: any) => (
                      <div key={compName} className="flex justify-between text-xs">
                        <span className="text-slate-400 capitalize">{compName.replace('_', ' ')}:</span>
                        <span className="text-slate-200">₹{compVal.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-cyan-400" />
                <span>Financial Returns</span>
              </h2>

              <div className="bg-slate-950/50 border border-slate-850 p-6 rounded-xl divide-y divide-slate-900">
                <div className="py-3 flex justify-between text-sm">
                  <span className="text-slate-400">Annual Water Saved Potential:</span>
                  <span className="text-white font-semibold">{analysis.harvesting_potential.annual_liters.toLocaleString()} Liters</span>
                </div>
                <div className="py-3 flex justify-between text-sm">
                  <span className="text-slate-400">Annual Savings:</span>
                  <span className="text-white font-semibold">₹{analysis.cost_analysis.annual_savings.toLocaleString()}</span>
                </div>
                <div className="py-3 flex justify-between text-sm">
                  <span className="text-slate-400">Payback Return Period:</span>
                  <span className="text-cyan-400 font-black text-lg">{analysis.cost_analysis.payback_years} Years</span>
                </div>
                <div className="py-3 flex justify-between text-sm">
                  <span className="text-slate-400">Return on Investment (ROI):</span>
                  <span className="text-emerald-400 font-bold">{analysis.cost_analysis.roi_percentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Purification sequence */}
        {activeTab === 'purification' && (
          <div className="space-y-6 animate-fadeInScale">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Filter className="h-6 w-6 text-cyan-400" />
              <span>Recommended Water Treatment Sequence</span>
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Since your primary intended use is <strong className="text-white">{user_data.intended_use}</strong>, we recommend the following sequence of filters to keep the water safe and clean:
            </p>

            <div className="grid md:grid-cols-3 gap-6 pt-4">
              {analysis.purification.treatment_sequence.map((stepName: string, index: number) => (
                <div key={index} className="bg-slate-950 border border-slate-850 p-6 rounded-xl relative flex flex-col justify-between">
                  <div className="absolute top-4 right-4 bg-slate-900 border border-slate-800 text-cyan-400 h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs">
                    0{index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2 pr-6 text-sm">{stepName}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {index === 0
                        ? 'Removes large leaves, twigs, debris and dirt directly from the rooftop collection pipes.'
                        : index === 1
                        ? 'Blocks sand, dust, and finer suspended solids using filter layers (sand, gravel, charcoal).'
                        : 'Treats potential pathogens/bacteria using chlorine tablets, UV sterilisation, or boiling before use.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {analysis.purification.warnings && analysis.purification.warnings.length > 0 && (
              <div className="bg-amber-950/20 border border-amber-900/50 p-4 rounded-xl flex items-start space-x-3 mt-4">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="text-xs text-amber-400 space-y-1">
                  <strong className="font-bold block text-white text-sm">Important Health & Safety Notes</strong>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.purification.warnings.map((warn: string, idx: number) => (
                      <li key={idx}>{warn}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
