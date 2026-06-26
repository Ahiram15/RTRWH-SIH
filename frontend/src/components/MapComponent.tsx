import React, { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MapPin } from 'lucide-react'

interface MapComponentProps {
  initialLat: number | null
  initialLng: number | null
  onLocationSelect: (lat: number, lng: number, address: string, details?: any) => void
}

const MAPTILER_API_KEY = 'mUiASIDIGsImfNM8L0hq'

export const MapComponent: React.FC<MapComponentProps> = ({
  initialLat,
  initialLng,
  onLocationSelect
}) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerRef = useRef<maplibregl.Marker | null>(null)
  const [mapStyle, setMapStyle] = useState<'satellite' | 'streets'>('satellite')

  const centerLat = initialLat || 20.5937 // Default to India center
  const centerLng = initialLng || 78.9629

  const streetsStyleUrl = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`
  const satelliteStyleUrl = `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_API_KEY}`

  // Reverse Geocoding Helper
  const reverseGeocode = async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_API_KEY}`
      )
      const data = await response.json()
      if (data.features && data.features.length > 0) {
        const topResult = data.features[0]
        const address = topResult.place_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        
        // Extract administrative details if present
        let state = ''
        let district = ''
        let pincode = ''
        
        if (topResult.context) {
          for (const item of topResult.context) {
            if (item.id.startsWith('region')) {
              state = item.text
            } else if (item.id.startsWith('county') || item.id.startsWith('district')) {
              district = item.text
            } else if (item.id.startsWith('postal_code')) {
              pincode = item.text
            }
          }
        }

        onLocationSelect(lat, lng, address, { state, district, pincode })
      } else {
        onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`, {})
      }
    } catch (e) {
      console.error('Error in reverse geocoding:', e)
      onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`, {})
    }
  }

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize Map
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle === 'satellite' ? satelliteStyleUrl : streetsStyleUrl,
      center: [centerLng, centerLat],
      zoom: initialLat && initialLng ? 16 : 5,
      pitch: initialLat && initialLng ? 60 : 0
    })

    mapRef.current = map

    // Initialize Marker
    const marker = new maplibregl.Marker({ draggable: true })
      .setLngLat([centerLng, centerLat])
      .addTo(map)

    markerRef.current = marker

    // Map Click Handler
    map.on('click', (e) => {
      const { lng, lat } = e.lngLat
      marker.setLngLat([lng, lat])
      
      map.flyTo({
        center: [lng, lat],
        zoom: 17,
        pitch: 50
      })

      reverseGeocode(lng, lat)
    })

    // Marker Dragend Handler
    marker.on('dragend', () => {
      const lngLat = marker.getLngLat()
      map.flyTo({
        center: [lngLat.lng, lngLat.lat],
        zoom: 17,
        pitch: 50
      })
      reverseGeocode(lngLat.lng, lngLat.lat)
    })

    map.on('load', () => {
      // 3D Buildings
      try {
        if (!map.getLayer('3d-buildings')) {
          map.addLayer({
            id: '3d-buildings',
            source: 'openmaptiles',
            'source-layer': 'building',
            type: 'fill-extrusion',
            minzoom: 15,
            paint: {
              'fill-extrusion-color': mapStyle === 'satellite' ? '#ffffff' : '#aaaaaa',
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': mapStyle === 'satellite' ? 0.7 : 0.6
            }
          })
        }
      } catch (err) {
        console.error('Failed to load 3D buildings:', err)
      }
    })

    return () => {
      map.remove()
    }
  }, [mapStyle])

  // Geolocate user
  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          if (mapRef.current && markerRef.current) {
            markerRef.current.setLngLat([longitude, latitude])
            mapRef.current.flyTo({
              center: [longitude, latitude],
              zoom: 18,
              pitch: 60,
              bearing: 90
            })
            reverseGeocode(longitude, latitude)
          }
        },
        (error) => {
          console.error('Error obtaining geolocation:', error)
          alert('Failed to detect geolocation. Please click on the map manually.')
        }
      )
    } else {
      alert('Geolocation is not supported by your browser.')
    }
  }

  return (
    <div className="relative w-full h-[350px] md:h-[450px] rounded-xl overflow-hidden border border-slate-700 shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
        <button
          type="button"
          onClick={() => setMapStyle(mapStyle === 'satellite' ? 'streets' : 'satellite')}
          className="bg-slate-900/90 text-slate-100 hover:bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-semibold rounded-lg shadow-md transition-colors"
        >
          {mapStyle === 'satellite' ? 'Show Streets' : 'Show Satellite'}
        </button>
        <button
          type="button"
          onClick={handleGeolocate}
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold px-3 py-2 text-xs rounded-lg shadow-md flex items-center justify-center space-x-1 transition-colors"
        >
          <MapPin className="h-4.5 w-4.5" />
          <span>My GPS Location</span>
        </button>
      </div>
    </div>
  )
}
