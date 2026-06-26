import React, { useState } from 'react'
import { Search, MapPin, Phone, Mail, Award, CheckCircle, ShieldCheck } from 'lucide-react'

interface Installer {
  id: string
  name: string
  location: string
  phone: string
  email: string
  rating: number
  experience: string
  services: string[]
  certified: boolean
}

const mockInstallers: Installer[] = [
  {
    id: '1',
    name: 'EcoWater Solutions India',
    location: 'Karnataka, Bangalore',
    phone: '+91 80 4567 8901',
    email: 'info@ecowater.in',
    rating: 4.8,
    experience: '8 years',
    services: ['Rooftop Harvesting', 'Filter Installation', 'Storage Tanks', 'Groundwater Recharge'],
    certified: true,
  },
  {
    id: '2',
    name: 'AquaSave Tech',
    location: 'Maharashtra, Mumbai',
    phone: '+91 22 2345 6789',
    email: 'contact@aquasavetech.com',
    rating: 4.6,
    experience: '6 years',
    services: ['Rooftop Harvesting', 'Purification Systems', 'Maintenance'],
    certified: true,
  },
  {
    id: '3',
    name: 'RainGuard Harvesting Systems',
    location: 'Tamil Nadu, Chennai',
    phone: '+91 44 9876 5432',
    email: 'hello@rainguard.com',
    rating: 4.9,
    experience: '12 years',
    services: ['Rooftop Harvesting', 'Community Projects', 'Aquifer Recharge', 'Filter Installation'],
    certified: true,
  },
  {
    id: '4',
    name: 'JalShakti Engineers',
    location: 'Delhi NCR, Noida',
    phone: '+91 120 345 6789',
    email: 'support@jalshakti.org',
    rating: 4.5,
    experience: '5 years',
    services: ['Rooftop Harvesting', 'Storage Tanks', 'Maintenance'],
    certified: true,
  },
  {
    id: '5',
    name: 'GreenEarth Hydrology',
    location: 'Telangana, Hyderabad',
    phone: '+91 40 8765 4321',
    email: 'projects@greenearthhydrology.com',
    rating: 4.7,
    experience: '10 years',
    services: ['Rooftop Harvesting', 'Groundwater Recharge', 'Soil Moisture Management', 'Purification Systems'],
    certified: true,
  },
  {
    id: '6',
    name: 'Vedic Water Harvesting Co.',
    location: 'Rajasthan, Jaipur',
    phone: '+91 141 555 0199',
    email: 'info@vedicwater.com',
    rating: 4.4,
    experience: '4 years',
    services: ['Rooftop Harvesting', 'Traditional Jal Kunds', 'Storage Tanks'],
    certified: false,
  }
]

export const FindInstallers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedService, setSelectedService] = useState('All')
  const [certifiedOnly, setCertifiedOnly] = useState(false)
  const [contactedId, setContactedId] = useState<string | null>(null)

  const allServices = ['All', ...Array.from(new Set(mockInstallers.flatMap(i => i.services)))]

  const filteredInstallers = mockInstallers.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesService = selectedService === 'All' || inst.services.includes(selectedService)
    const matchesCertification = !certifiedOnly || inst.certified
    return matchesSearch && matchesService && matchesCertification
  })

  const handleContact = (id: string) => {
    setContactedId(id)
    setTimeout(() => {
      setContactedId(null)
      alert('Thank you! A contact request has been sent to the installer. They will get back to you shortly.')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Find Certified Installers
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Connect with verified, high-quality professionals in your area to implement your custom rainwater harvesting system.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Search bar */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Search by Name or Location</label>
            <div className="relative">
              <input
                type="text"
                placeholder="E.g. Bangalore, Aquasave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            </div>
          </div>

          {/* Service Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Filter by Service</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 px-4 text-sm text-slate-100 outline-none transition-colors"
            >
              {allServices.map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Certification */}
          <div className="flex items-center space-x-3 py-2">
            <input
              type="checkbox"
              id="certified"
              checked={certifiedOnly}
              onChange={(e) => setCertifiedOnly(e.target.checked)}
              className="h-5 w-5 rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-950 cursor-pointer"
            />
            <label htmlFor="certified" className="text-sm font-medium text-slate-300 cursor-pointer flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <span>Show Certified Installers Only</span>
            </label>
          </div>
        </div>

        {/* Installers List Grid */}
        {filteredInstallers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstallers.map((inst) => (
              <div
                key={inst.id}
                className="bg-slate-900/40 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-cyan-950/20 transition-all duration-300 group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-1 bg-cyan-950/50 border border-cyan-800 text-cyan-400 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      <Award className="h-3 w-3" />
                      <span>{inst.experience} Exp</span>
                    </div>
                    {inst.certified && (
                      <div className="flex items-center space-x-1 bg-emerald-950/50 border border-emerald-800 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        <CheckCircle className="h-3 w-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Title & Rating */}
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                    {inst.name}
                  </h3>
                  <div className="flex items-center space-x-1.5 mb-4">
                    <div className="flex text-amber-400 text-sm">
                      {'★'.repeat(Math.floor(inst.rating))}
                      {inst.rating % 1 !== 0 ? '½' : ''}
                    </div>
                    <span className="text-slate-400 text-xs font-medium">({inst.rating} / 5.0)</span>
                  </div>

                  {/* Info details */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-2 text-xs text-slate-300">
                      <MapPin className="h-4 w-4 text-cyan-500 shrink-0" />
                      <span>{inst.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-300">
                      <Phone className="h-4 w-4 text-cyan-500 shrink-0" />
                      <span>{inst.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-300">
                      <Mail className="h-4 w-4 text-cyan-500 shrink-0" />
                      <span className="truncate">{inst.email}</span>
                    </div>
                  </div>

                  {/* Services tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {inst.services.map((svc) => (
                      <span
                        key={svc}
                        className="bg-slate-950 border border-slate-800 text-[10px] text-slate-400 px-2 py-0.5 rounded-md"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleContact(inst.id)}
                  disabled={contactedId !== null}
                  className={`w-full font-semibold text-sm py-2.5 px-4 rounded-xl transition-all shadow-md ${
                    contactedId === inst.id
                      ? 'bg-emerald-500 text-slate-950 cursor-default'
                      : 'bg-cyan-500 hover:bg-cyan-600 text-slate-950 hover:shadow-cyan-500/20'
                  }`}
                >
                  {contactedId === inst.id ? 'Connecting...' : 'Request Quote / Callback'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/20 border border-slate-800 rounded-2xl">
            <p className="text-slate-400 font-medium text-lg">No installers found matching your filters.</p>
            <p className="text-slate-600 text-sm mt-1">Try clearing search terms or modifying filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
