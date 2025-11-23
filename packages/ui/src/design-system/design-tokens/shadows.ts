const SHADOW_OPACITY_20 = 0.2
const SHADOW_OPACITY_12 = 0.12

const SHADOW_COLOR_20 = {
    hex: '#040817',
    hsla: `hsl(229 85% 5% / ${SHADOW_OPACITY_20})`,
}

const SHADOW_COLOR_12 = {
    hex: '#040817',
    hsla: `hsl(229 85% 5% / ${SHADOW_OPACITY_12})`,
}

export const boxShadows = {
    '2xs': `0 1px ${SHADOW_COLOR_12.hsla}`,
    xs: `0 1px 2px 0px ${SHADOW_COLOR_12.hsla}`,
    sm: `0 1px 3px 0px ${SHADOW_COLOR_20.hsla}, 0 1px 2px -1px ${SHADOW_COLOR_12.hsla}`,
    md: `0 4px 6px -1px ${SHADOW_COLOR_20.hsla}, 0 2px 4px -2px ${SHADOW_COLOR_12.hsla}`,
    lg: `0 10px 15px -3px ${SHADOW_COLOR_20.hsla}, 0 4px 6px -4px ${SHADOW_COLOR_12.hsla}`,
    xl: `0 20px 25px -5px ${SHADOW_COLOR_20.hsla}, 0 10px 10px -5px ${SHADOW_COLOR_12.hsla}`,
    '2xl': `0 25px 50px -12px ${SHADOW_COLOR_20.hsla}`,
}
type BoxShadowToken = keyof typeof boxShadows
export type ShadowToken = BoxShadowToken

export const shadows = {
    hard1: {
        boxShadow: `-2px 2px 8px 0px ${SHADOW_COLOR_20.hsla}`,
        offset: {
            x: -2,
            y: 2,
        },
        radius: 8,
        spread: 0,
        color: SHADOW_COLOR_20.hsla,
        inset: false,
    },
    hard2: {
        boxShadow: `0 3px 10px 0px ${SHADOW_COLOR_20.hsla}`,
        offset: {
            x: 0,
            y: 3,
        },
        radius: 10,
        spread: 0,
        color: SHADOW_COLOR_20.hsla,
        inset: false,
    },
    hard3: {
        boxShadow: `2px 2px 8px 0px ${SHADOW_COLOR_20.hsla}`,
        offset: {
            x: 2,
            y: 2,
        },
        radius: 8,
        spread: 0,
        color: SHADOW_COLOR_20.hsla,
        inset: false,
    },
    hard4: {
        boxShadow: `0 -3px 10px 0px ${SHADOW_COLOR_20.hsla}`,
        offset: {
            x: 0,
            y: -3,
        },
        radius: 10,
        spread: 0,
        color: SHADOW_COLOR_20.hsla,
        inset: false,
    },
    hard5: {
        boxShadow: `0 2px 10px 0px ${SHADOW_COLOR_12.hsla}`,
        offset: {
            x: 0,
            y: 2,
        },
        radius: 10,
        spread: 0,
        color: SHADOW_COLOR_12.hsla,
        inset: false,
    },
    soft1: {
        boxShadow: `0 0 10px ${SHADOW_COLOR_12.hsla}`,
        offset: {
            x: 0,
            y: 0,
        },
        radius: 10,
        spread: 0,
        color: SHADOW_COLOR_12.hsla,
        inset: false,
    },
    soft2: {
        boxShadow: `0 0 20px ${SHADOW_COLOR_20.hsla}`,
        offset: {
            x: 0,
            y: 0,
        },
        radius: 20,
        spread: 0,
        color: SHADOW_COLOR_20.hsla,
        inset: false,
    },
    soft3: {
        boxShadow: `0 0 30px ${SHADOW_COLOR_12.hsla}`,
        offset: {
            x: 0,
            y: 0,
        },
        radius: 30,
        spread: 0,
        color: SHADOW_COLOR_12.hsla,
        inset: false,
    },
    soft4: {
        boxShadow: `0 0 40px ${SHADOW_COLOR_12.hsla}`,
        offset: {
            x: 0,
            y: 0,
        },
        radius: 40,
        spread: 0,
        color: SHADOW_COLOR_12.hsla,
        inset: false,
    },
}

export type ShadowsToken = keyof typeof shadows
