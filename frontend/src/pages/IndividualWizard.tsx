import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import { MapComponent } from '../components/MapComponent'
import { ArrowLeft, ArrowRight, Save, MapPin, Calculator, Users } from 'lucide-react'

export const IndividualWizard: React.FC = () => {
  const { data, updateData } = useAssessment()
  const navigate = useNavigate()

  const isCommunity = data.assessmentType === 'community'

  // Wizard Steps: 1 = Location, 2 = Basic Info / Size, 3 = Usage & Sources, 4 = Measurements
  const [step, setStep] = useState(1)

  // Form Fields State
  const [name, setName] = useState(data.fullName || (isCommunity ? 'Community User' : ''))
  const [contactNumber, setContactNumber] = useState(data.contactNumber || '')
  
  // Individual fields
  const [householdSize, setHouseholdSize] = useState(data.householdSize || 4)
  const [propertyType, setPropertyType] = useState(data.propertyType || 'Residential')
  const [roofType, setRoofType] = useState(data.roofType || 'Concrete/RCC')
  const [buildingAge, setBuildingAge] = useState(data.buildingAge || 'new')
  
  // Community fields
  const [numHouseholds, setNumHouseholds] = useState(50)
  const [avgHouseholdSize, setAvgHouseholdSize] = useState(4)
  const [numBuildings, setNumBuildings] = useState(10)
  const [avgRooftopArea, setAvgRooftopArea] = useState(120) // in sq m
  const [totalOpenSpace, setTotalOpenSpace] = useState(250) // in sq m

  // Shared fields
  const [existingWaterSources, setExistingWaterSources] = useState<string[]>(data.existingWaterSources || [])
  const [intendedUse, setIntendedUse] = useState(data.intendedUse || 'general')
  const [rooftopArea, setRooftopArea] = useState(data.rooftopArea || 100) // in sq m
  const [openSpaceArea, setOpenSpaceArea] = useState(data.openSpaceArea || 20) // in sq m
  const [occupancy, setOccupancy] = useState(data.occupancy || 4)

  // Map state
  const [lat, setLat] = useState<number | null>(data.latitude)
  const [lng, setLng] = useState<number | null>(data.longitude)
  const [address, setAddress] = useState(data.address || '')

  // Calculator Helper State
  const [calcLength, setCalcLength] = useState('')
  const [calcWidth, setCalcWidth] = useState('')

  const handleLocationSelect = (selectedLat: number, selectedLng: number, selectedAddress: string, _details?: any) => {
    setLat(selectedLat)
    setLng(selectedLng)
    setAddress(selectedAddress)
  }

  const toggleSource = (source: string) => {
    if (existingWaterSources.includes(source)) {
      setExistingWaterSources(existingWaterSources.filter((s) => s !== source))
    } else {
      setExistingWaterSources([...existingWaterSources, source])
    }
  }

  const handleCalculator = () => {
    const l = parseFloat(calcLength)
    const w = parseFloat(calcWidth)
    if (!isNaN(l) && !isNaN(w)) {
      setRooftopArea(parseFloat((l * w).toFixed(2)))
    }
  }

  const nextStep = () => {
    if (step === 1 && (!lat || !lng || !address)) {
      alert('Please select a location on the map first.')
      return
    }
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Aggregate community values if community mode
    const finalHouseholdSize = isCommunity ? numHouseholds * avgHouseholdSize : householdSize
    const finalRooftopArea = isCommunity ? numBuildings * avgRooftopArea : rooftopArea
    const finalOpenSpaceArea = isCommunity ? totalOpenSpace : openSpaceArea
    const finalPropertyType = isCommunity ? 'Community' : propertyType
    const finalOccupancy = isCommunity ? finalHouseholdSize : occupancy

    const payload = {
      name: name || (isCommunity ? 'Community User' : 'Guest'),
      location_name: address,
      user_lat: lat,
      user_lon: lng,
      household_size: finalHouseholdSize,
      rooftop_area: finalRooftopArea,
      open_space_area: finalOpenSpaceArea,
      roof_type: roofType,
      property_type: finalPropertyType,
      existing_water_sources: existingWaterSources,
      intended_use: intendedUse,
      building_age: buildingAge,
      occupancy: finalOccupancy
    }

    try {
      const response = await fetch('/api/submit_form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const resData = await response.json()
      if (response.ok && resData.entry_id) {
        updateData({
          fullName: name,
          contactNumber,
          latitude: lat,
          longitude: lng,
          address,
          householdSize: finalHouseholdSize,
          rooftopArea: finalRooftopArea,
          openSpaceArea: finalOpenSpaceArea,
          existingWaterSources,
          intendedUse,
          propertyType: finalPropertyType,
          buildingAge,
          occupancy: finalOccupancy,
        })
        navigate(`/results?entry_id=${resData.entry_id}`)
      } else {
        alert(resData.error || 'Failed to submit the assessment.')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      alert('An error occurred during submission. Please try again.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Progress header */}
      <div className="mb-10 text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-white">
          {isCommunity ? 'Community assessment' : 'Tell Us About Your Property'}
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Help us provide accurate recommendations by sharing details about your property and requirements.
        </p>

        {/* Wizard Progress steps */}
        <div className="flex justify-center items-center space-x-3 pt-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                s === step
                  ? 'bg-cyan-400 ring-4 ring-cyan-950 shadow-md shadow-cyan-500/20'
                  : s < step
                  ? 'bg-cyan-500/60'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* STEP 1: Location Setup */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeInScale">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-cyan-400" />
                  <span>Interactive Map & Coordinates</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Provide your location. Click on the map or drag the marker to set your property location.
                </p>
              </div>

              <MapComponent
                initialLat={lat}
                initialLng={lng}
                onLocationSelect={handleLocationSelect}
              />

              {address && (
                <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-slate-400">Selected Address:</div>
                  <div className="text-sm text-cyan-400 font-medium">{address}</div>
                  <div className="text-xs text-slate-500 flex space-x-4 pt-1">
                    <span>Latitude: {lat?.toFixed(6)}</span>
                    <span>Longitude: {lng?.toFixed(6)}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl flex items-center space-x-2 shadow-md"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Basic Info & Property Sizes */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeInScale">
              <h3 className="text-xl font-bold text-white border-b border-slate-850 pb-2 mb-4">
                Basic Info & Specifications
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Jane Doe"
                    className="w-full bg-slate-950/60 border border-slate-800 text-white placeholder-slate-600 rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="e.g., 9876543210"
                    className="w-full bg-slate-950/60 border border-slate-800 text-white placeholder-slate-600 rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-sm"
                  />
                </div>

                {!isCommunity ? (
                  /* Individual properties */
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2">Household Size</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        required
                        value={householdSize}
                        onChange={(e) => setHouseholdSize(parseInt(e.target.value))}
                        className="w-full bg-slate-950/60 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2">Property Type</label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-sm"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Institutional">Institutional</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2">Building Age / Type</label>
                      <select
                        value={buildingAge}
                        onChange={(e) => setBuildingAge(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-sm"
                      >
                        <option value="new">Modern / New Construction</option>
                        <option value="existing">Existing Structure</option>
                        <option value="heritage">Heritage / Old Construction</option>
                      </select>
                    </div>
                    {propertyType !== 'Residential' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-2">Commercial Occupancy / Visitors</label>
                        <input
                          type="number"
                          min="1"
                          value={occupancy}
                          onChange={(e) => setOccupancy(parseInt(e.target.value))}
                          className="w-full bg-slate-950/60 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-sm"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  /* Community specifications */
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2">Number of Households</label>
                      <input
                        type="number"
                        min="1"
                        value={numHouseholds}
                        onChange={(e) => setNumHouseholds(parseInt(e.target.value))}
                        className="w-full bg-slate-950/60 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2">Avg Household Size</label>
                      <input
                        type="number"
                        min="1"
                        value={avgHouseholdSize}
                        onChange={(e) => setAvgHouseholdSize(parseInt(e.target.value))}
                        className="w-full bg-slate-950/60 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2">Number of Buildings</label>
                      <input
                        type="number"
                        min="1"
                        value={numBuildings}
                        onChange={(e) => setNumBuildings(parseInt(e.target.value))}
                        className="w-full bg-slate-950/60 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2">Avg Rooftop Area per Building (sq m)</label>
                      <input
                        type="number"
                        min="1"
                        value={avgRooftopArea}
                        onChange={(e) => setAvgRooftopArea(parseFloat(e.target.value))}
                        className="w-full bg-slate-950/60 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-400 mb-2">Total Open Area (sq m)</label>
                      <input
                        type="number"
                        min="0"
                        value={totalOpenSpace}
                        onChange={(e) => setTotalOpenSpace(parseFloat(e.target.value))}
                        className="w-full bg-slate-950/60 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-sm"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300 font-medium px-6 py-2.5 rounded-xl flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4.5 w-4.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Sources & Usage */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeInScale">
              <h3 className="text-xl font-bold text-white border-b border-slate-850 pb-2 mb-4">
                Existing Water Sources & Intended Use
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-3">
                    Existing Water Sources (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      'Municipal Supply',
                      'Private Borewell',
                      'Open Well',
                      'Water Tanker'
                    ].map((src) => {
                      const selected = existingWaterSources.includes(src)
                      return (
                        <button
                          key={src}
                          type="button"
                          onClick={() => toggleSource(src)}
                          className={`p-4 rounded-xl border text-center transition-all text-xs font-semibold ${
                            selected
                              ? 'bg-cyan-950/30 border-cyan-500 text-cyan-400'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {src}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">
                      Primary Intended Use of Harvested Water
                    </label>
                    <select
                      value={intendedUse}
                      onChange={(e) => setIntendedUse(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-sm"
                    >
                      <option value="general">General Domestic Purpose</option>
                      <option value="drinking">Drinking & Cooking (Requires higher filtration)</option>
                      <option value="irrigation">Gardening & Irrigation</option>
                      <option value="recharge">Groundwater Recharge Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Roof Material / Type</label>
                    <select
                      value={roofType}
                      onChange={(e) => setRoofType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-sm"
                    >
                      <option value="Concrete/RCC">Concrete / RCC Roof</option>
                      <option value="Tile Roof">Clay Tiles</option>
                      <option value="Metal Sheet">Metal Sheets</option>
                      <option value="Mixed">Mixed Construction</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300 font-medium px-6 py-2.5 rounded-xl flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4.5 w-4.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Measurements & Submit */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeInScale">
              <h3 className="text-xl font-bold text-white border-b border-slate-850 pb-2 mb-4">
                Area Measurements
              </h3>

              {!isCommunity ? (
                /* Individual Property sizing */
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2">
                        Rooftop Catchment Area (sq meters)
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={rooftopArea}
                        onChange={(e) => setRooftopArea(parseFloat(e.target.value))}
                        className="w-full bg-slate-950/60 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2">
                        Available Open Yard Space (sq meters)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={openSpaceArea}
                        onChange={(e) => setOpenSpaceArea(parseFloat(e.target.value))}
                        className="w-full bg-slate-950/60 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {/* Calculator Helper tool */}
                  <div className="bg-slate-950/40 border border-slate-850 p-6 rounded-xl space-y-4">
                    <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                      <Calculator className="h-4.5 w-4.5 text-cyan-400" />
                      <span>Rooftop Area Calculator (L × W)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      If you don't know the exact area, type the dimensions of your roof in meters below:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Length (m)</label>
                        <input
                          type="number"
                          value={calcLength}
                          onChange={(e) => setCalcLength(e.target.value)}
                          placeholder="e.g., 10"
                          className="w-full bg-slate-900 border border-slate-800 text-white text-xs rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Width (m)</label>
                        <input
                          type="number"
                          value={calcWidth}
                          onChange={(e) => setCalcWidth(e.target.value)}
                          placeholder="e.g., 10"
                          className="w-full bg-slate-900 border border-slate-800 text-white text-xs rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleCalculator}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-cyan-300 font-semibold p-2.5 text-xs rounded-lg transition-colors flex items-center justify-center space-x-1"
                      >
                        <span>Calculate Area</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Community aggregate view before submit */
                <div className="bg-slate-950/40 border border-slate-850 p-6 rounded-xl space-y-4">
                  <h4 className="text-md font-bold text-white flex items-center space-x-2">
                    <Users className="h-5 w-5 text-cyan-400" />
                    <span>Community Summary</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-850">
                      <span className="text-slate-500 block">Total Households:</span>
                      <span className="text-lg text-white font-bold">{numHouseholds}</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-850">
                      <span className="text-slate-500 block">Total Buildings:</span>
                      <span className="text-lg text-white font-bold">{numBuildings}</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-850">
                      <span className="text-slate-500 block">Total Rooftop Area:</span>
                      <span className="text-lg text-cyan-400 font-bold">{(numBuildings * avgRooftopArea).toFixed(0)} sq m</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-850">
                      <span className="text-slate-500 block">Total Open Space:</span>
                      <span className="text-lg text-cyan-400 font-bold">{totalOpenSpace} sq m</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300 font-medium px-6 py-2.5 rounded-xl flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4.5 w-4.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-8 py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-cyan-500/10"
                >
                  <Save className="h-5 w-5" />
                  <span>Get Feasibility Assessment</span>
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  )
}
