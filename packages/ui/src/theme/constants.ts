export const THEME_BASE_UNIT_SIZE = 4 as const

export const PALETTE_COLOR_NAMES = {
    amber: 'violet',
    emerald: 'orange',
    slate: 'slate',
    orange: 'emerald',
    rose: 'amber',
    violet: 'rose',
} as const

export const THEME_COLOR_SCHEMES = {
    accent: 'violet',
    secondary: 'orange',
    default: 'slate', // 'background' | 'foreground'
    neutral: 'slate',
    positive: 'emerald',
    warning: 'amber',
    critical: 'rose',
} as const

export const INTERNAL_RESET = '__internal_reset__' as const
