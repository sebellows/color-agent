export const THEME_BASE_UNIT_SIZE = 4 as const

export const PALETTE_COLOR_NAMES = {
    amber: 'amber',
    emerald: 'emerald',
    slate: 'slate',
    orange: 'orange',
    rose: 'rose',
    violet: 'violet',
} as const

export const THEME_COLOR_SCHEMES = {
    primary: 'violet',
    accent: 'orange',
    default: 'slate', // 'background' | 'foreground'
    neutral: 'slate',
    positive: 'emerald',
    warning: 'amber',
    critical: 'rose',
} as const

export const INTERNAL_RESET = '__internal_reset__' as const
