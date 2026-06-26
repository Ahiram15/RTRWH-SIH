import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LanguageSwitcher } from './LanguageSwitcher'
import logoImg from '../assets/logo.png'

export const Header: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'text-cyan-400 font-semibold'
      : 'text-slate-300 hover:text-cyan-400 transition-colors'
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logoImg} alt="Logo" className="h-8 w-8 object-contain rounded-lg" />
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            RTRWH Portal
          </span>
        </Link>

        <nav className="hidden md:flex space-x-8 text-sm">
          <Link to="/" className={isActive('/')}>
            Home
          </Link>
          <Link to="/assessment" className={isActive('/assessment')}>
            Assessment
          </Link>
          <Link to="/subsidies" className={isActive('/subsidies')}>
            Subsidies
          </Link>
          <Link to="/resources" className={isActive('/resources')}>
            Resources
          </Link>
          <Link to="/installers" className={isActive('/installers')}>
            Installers
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
