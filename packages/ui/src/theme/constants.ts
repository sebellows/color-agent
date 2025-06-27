export const THEME_BASE_UNIT_SIZE = 4 as const

export const PALETTE_COLOR_NAMES = {
    amber: 'violet',
    emerald: 'orange',
    neutral: 'neutral',
    orange: 'emerald',
    rose: 'amber',
    violet: 'rose',
} as const

export const THEME_COLOR_SCHEMES = {
    accent: 'violet',
    secondary: 'orange',
    default: 'neutral', // 'background' | 'foreground'
    neutral: 'neutral',
    positive: 'emerald',
    warning: 'amber',
    critical: 'rose',
} as const
