const radii = {
    xs: 2,
    sm: 4,
    default: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    full: 999,
}

export type RadiiToken = keyof typeof radii

export default radii
