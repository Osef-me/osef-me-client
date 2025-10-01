import type React from 'react'
import { MdHome, MdMusicNote, MdShuffle, MdSettings } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'
import Logo from '@/assets/logo.svg?react'
import ThemeManager from '@/components/organisms/ThemeManager/ThemeManager'
import type { NavbarTemplateProps } from './Navbar.props'

interface NavItem {
  label: string
  path: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  matchPath?: (pathname: string) => boolean
}

const navItems: NavItem[] = [
  {
    label: 'Current',
    path: '/current',
    icon: MdMusicNote,
    matchPath: (pathname) => pathname.startsWith('/current'),
  },
  {
    label: 'List',
    path: '/',
    icon: MdHome,
    matchPath: (pathname) => pathname === '/',
  },
  {
    label: 'Random',
    path: '/random',
    icon: MdShuffle,
    matchPath: (pathname) => pathname.startsWith('/random'),
  },
]

const Navbar: React.FC<NavbarTemplateProps> = ({
  brandName = 'Osef.me',
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (item: NavItem) => {
    return item.matchPath ? item.matchPath(location.pathname) : location.pathname === item.path
  }

  return (
    <nav className="bg-base-200/80 backdrop-blur-md border-b border-base-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand - clickable pour retourner à l'accueil */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Logo
              aria-label={brandName}
              className="h-10 w-10 transition-transform duration-200 group-hover:scale-110"
            />
            <span className="text-xl font-bold text-base-content hidden sm:block">
              {brandName}
            </span>
          </button>

          {/* Navigation tabs au centre */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const active = isActive(item)
              const Icon = item.icon
              
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg
                    transition-all duration-200 font-medium
                    ${
                      active
                        ? 'bg-primary text-primary-content shadow-lg scale-105'
                        : 'text-base-content hover:bg-base-300 hover:scale-105'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Settings and Theme switcher à droite */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${
                  location.pathname === '/settings'
                    ? 'bg-primary text-primary-content'
                    : 'text-base-content hover:bg-base-300'
                }
              `}
              title="Settings"
            >
              <MdSettings size={24} />
            </button>
            <ThemeManager />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
