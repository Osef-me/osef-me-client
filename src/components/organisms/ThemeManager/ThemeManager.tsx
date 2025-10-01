import type React from 'react'
import ThemeSwitcher from '@/components/atoms/actions/ThemeSwitcher/ThemeSwitcher'
import { useTheme } from '@/context/ThemeContext'

const ThemeManager: React.FC = () => {
  const { currentTheme, setTheme, themes } = useTheme()

  return <ThemeSwitcher currentTheme={currentTheme} onThemeChange={setTheme} themes={themes} />
}

export default ThemeManager
