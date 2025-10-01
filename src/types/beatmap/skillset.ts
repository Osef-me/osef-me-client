export const getSkillsetShortcut = (pattern: string): string => {
  const shortcuts: Record<string, string> = {
    jumpstream: 'JS',
    handstream: 'HS',
    jackspeed: 'SJ',
    stamina: 'Stam',
    stream: 'Stream',
    chordjack: 'CJ',
    technical: 'Tech',
    hybrid: 'Hybrid',
    ln: 'LN',
  }

  return shortcuts[pattern.toLowerCase()] || pattern
}

import type { ColorName } from '@/types/colors'

// Fonction pour obtenir la couleur d'un pattern
export const getSkillsetColor = (pattern: string): ColorName => {
  const colorMap: Record<string, ColorName> = {
    jumpstream: 'blue',
    technical: 'purple',
    chordjack: 'red',
    stream: 'green',
    stamina: 'orange',
    handstream: 'teal',
    jackspeed: 'yellow',
    hybrid: 'yellow', // Jaune pour hybrid
    ln: 'blue', // Bleu pour LN
  }

  return colorMap[pattern.toLowerCase()] || 'gray'
}
