import type React from 'react'
import { MdPalette } from 'react-icons/md'

export interface ThemeSwitcherProps {
  currentTheme: string
  onThemeChange: (theme: string) => void
  themes: string[]
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange, themes }) => {
  return (
    <div className="dropdown dropdown-end">
      <button type="button" className="btn btn-ghost btn-circle">
        <MdPalette size={20} />
      </button>
      <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-96 overflow-y-auto">
        {themes.map((theme) => (
          <li key={theme}>
            <button
              type="button"
              onClick={() => onThemeChange(theme)}
              className={`text-left capitalize ${
                currentTheme === theme ? 'bg-primary text-primary-content' : ''
              }`}
            >
              {theme}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ThemeSwitcher
