import React from 'react'
import { Droplet } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-8 px-4 mt-auto text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <Droplet className="h-5 w-5 text-cyan-500" />
          <span className="font-semibold text-slate-400">Rooftop Rainwater Harvesting (RTRWH) Portal</span>
        </div>
        <p className="text-center md:text-right">
          © {new Date().getFullYear()} Water Conservation Initiative. Built to assess rainwater harvesting potential and conservation structures.
        </p>
      </div>
    </footer>
  )
}
