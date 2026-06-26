import React, { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

interface ResultsMapComponentProps {
  userLat: number
  userLng: number
  userAddress: string
  stationLat: number
  stationLng: number
  stationName: string
  stationDetails: {
    state: string
    rainfall: number
    soilType: string
    depth: number
    infiltration: string | number
    aquifer: string
  }
}

const MAPTILER_API_KEY = 'mUiASIDIGsImfNM8L0hq'

// Color determination functions
const getColorForRainfall = (val: number) => {
  if (val > 750) return '#2b8cbe'
  if (val >= 400) return '#7bccc4'
  return '#fa9fb5'
}

const getColorForSoil = (val: string) => {
  const v = val.toLowerCase()
  if (v.includes('sand')) return '#fed976'
  if (v.includes('loam')) return '#ae017e'
  if (v.includes('clay')) return '#cc4c02'
  return '#bdbdbd'
}

const getColorForInfiltration = (val: number | string) => {
  const num = typeof val === 'number' ? val : parseFloat(val)
  if (isNaN(num)) return '#808080'
  if (num > 15) return '#2b8cbe'
  if (num >= 10) return '#7bccc4'
  return '#fa9fb5'
}

const getColorForAquifer = (val: string) => {
  const v = val.toLowerCase()
  if (v.includes('confined') && !v.includes('semi')) return '#f59e0b'
  if (v.includes('unconfined')) return '#06b6d4'
  if (v.includes('semi')) return '#10b981'
  if (v.includes('fractured')) return '#8b5cf6'
  return '#9ca3af'
}

export const ResultsMapComponent: React.FC<ResultsMapComponentProps> = ({
  userLat,
  userLng,
  userAddress,
  stationLat,
  stationLng,
  stationName,
  stationDetails,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  
  const [selectedOption, setSelectedOption] = useState<'rainfall' | 'soil' | 'infiltration' | 'aquifer'>('rainfall')

  // Get active color based on active layers
  const getActiveColor = () => {
    switch (selectedOption) {
      case 'rainfall':
        return getColorForRainfall(stationDetails.rainfall)
      case 'soil':
        return getColorForSoil(stationDetails.soilType)
      case 'infiltration':
        return getColorForInfiltration(stationDetails.infiltration)
      case 'aquifer':
        return getColorForAquifer(stationDetails.aquifer)
      default:
        return '#06b6d4'
    }
  }

  const activeColor = getActiveColor()

  useEffect(() => {
    if (!mapContainer.current) return

    const centerLng = (userLng + stationLng) / 2
    const centerLat = (userLat + stationLat) / 2

    // Initialize map
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_API_KEY}`,
      center: [centerLng, centerLat],
      zoom: 12,
      pitch: 45,
    })

    mapRef.current = map

    // 1. Create User Marker Bubble (pulsing, custom dynamic color)
    const userEl = document.createElement('div')
    userEl.className = 'relative flex items-center justify-center'
    userEl.style.width = '36px'
    userEl.style.height = '36px'
    userEl.innerHTML = `
      <span class="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style="background-color: ${activeColor};"></span>
      <span class="relative inline-flex rounded-full h-6 w-6 border-2 border-white shadow-md transition-colors duration-300" style="background-color: ${activeColor};"></span>
    `

    const userPopup = new maplibregl.Popup({ offset: 15 }).setHTML(`
      <div class="p-3 text-slate-900 font-sans max-w-xs">
        <h4 class="font-bold text-sm text-cyan-600 mb-1">Your Property</h4>
        <p class="text-xs text-slate-600 leading-relaxed mb-2">${userAddress}</p>
        <div class="text-[10px] text-slate-400">
          Lat: ${userLat.toFixed(5)}, Lng: ${userLng.toFixed(5)}
        </div>
      </div>
    `)

    new maplibregl.Marker({ element: userEl })
      .setLngLat([userLng, userLat])
      .setPopup(userPopup)
      .addTo(map)

    // 2. Create Nearest Station Marker Bubble (smaller, static custom dynamic color)
    const stationEl = document.createElement('div')
    stationEl.className = 'relative flex items-center justify-center'
    stationEl.style.width = '26px'
    stationEl.style.height = '26px'
    stationEl.innerHTML = `
      <span class="relative inline-flex rounded-full h-5 w-5 border-2 border-white shadow-md transition-colors duration-300" style="background-color: ${activeColor};"></span>
    `

    const stationPopup = new maplibregl.Popup({ offset: 15 }).setHTML(`
      <div class="p-3 text-slate-900 font-sans max-w-xs">
        <h4 class="font-bold text-sm text-blue-600 mb-1.5">Nearest CGWB Station</h4>
        <div class="text-xs font-semibold text-slate-800 mb-2">${stationName}</div>
        <div class="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-600">
          <div><strong>State:</strong> ${stationDetails.state}</div>
          <div><strong>Rainfall:</strong> ${stationDetails.rainfall} mm</div>
          <div><strong>Soil Type:</strong> ${stationDetails.soilType}</div>
          <div><strong>GW Depth:</strong> ${stationDetails.depth} m</div>
          <div><strong>Infiltration:</strong> ${stationDetails.infiltration} mm/h</div>
          <div><strong>Aquifer:</strong> ${stationDetails.aquifer}</div>
        </div>
      </div>
    `)

    new maplibregl.Marker({ element: stationEl })
      .setLngLat([stationLng, stationLat])
      .setPopup(stationPopup)
      .addTo(map)

    // Auto open user popup on load
    userPopup.addTo(map)

    // Fit bounds to contain both markers
    const bounds = new maplibregl.LngLatBounds()
    bounds.extend([userLng, userLat])
    bounds.extend([stationLng, stationLat])
    map.fitBounds(bounds, { padding: 60, maxZoom: 15 })

    // Add navigation and fullscreen controls
    map.addControl(new maplibregl.NavigationControl(), 'top-right')
    map.addControl(new maplibregl.FullscreenControl(), 'top-right')

    return () => {
      map.remove()
    }
  }, [userLat, userLng, stationLat, stationLng, userAddress, stationName, stationDetails, selectedOption, activeColor])

  // Legend Items definition
  const legendItems = {
    rainfall: [
      { color: '#2b8cbe', label: 'High (>750 mm)' },
      { color: '#7bccc4', label: 'Moderate (400-750 mm)' },
      { color: '#fa9fb5', label: 'Low (<400 mm)' },
    ],
    soil: [
      { color: '#fed976', label: 'Sandy' },
      { color: '#ae017e', label: 'Loamy' },
      { color: '#cc4c02', label: 'Clayey' },
      { color: '#bdbdbd', label: 'Other' },
    ],
    infiltration: [
      { color: '#2b8cbe', label: 'High (>15 mm/hr)' },
      { color: '#7bccc4', label: 'Moderate (10-15 mm/hr)' },
      { color: '#fa9fb5', label: 'Low (<10 mm/hr)' },
    ],
    aquifer: [
      { color: '#f59e0b', label: 'Confined' },
      { color: '#06b6d4', label: 'Unconfined' },
      { color: '#10b981', label: 'Semi-confined' },
      { color: '#8b5cf6', label: 'Fractured' },
      { color: '#9ca3af', label: 'Other' },
    ],
  }

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col">
      {/* Top Map Options Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 p-3 flex flex-wrap gap-2 items-center justify-between z-10">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Map Visual:</span>
        <div className="flex flex-wrap gap-1">
          {(['rainfall', 'soil', 'infiltration', 'aquifer'] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setSelectedOption(opt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all ${
                selectedOption === opt
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas */}
      <div ref={mapContainer} className="w-full flex-grow relative" />

      {/* Legend overlay */}
      <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800 p-4 rounded-xl text-xs text-slate-400 space-y-2 z-10 shadow-lg min-w-[170px] backdrop-blur-sm">
        <h4 className="font-bold text-white text-[11px] uppercase tracking-wider mb-2 border-b border-slate-900 pb-1.5 capitalize">
          {selectedOption} Range
        </h4>
        <div className="space-y-2">
          {legendItems[selectedOption].map((item) => (
            <div key={item.label} className="flex items-center space-x-2">
              <span
                className="h-3.5 w-3.5 rounded-full border border-white/20 inline-block shrink-0"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-[11px] text-slate-300 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-900 pt-2 mt-2 space-y-1 text-[10px] text-slate-500">
          <div className="flex items-center space-x-1">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
            <span>Pulse: Your Property</span>
          </div>
          <div>Solid Bubble: CGWB Station</div>
        </div>
      </div>
    </div>
  )
}
