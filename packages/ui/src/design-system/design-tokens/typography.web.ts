import { Config } from '../../config'
import { resolveFontFamilyProps, resolveSizeProps } from './resolvers/resolvers.web'
import { TYPOGRAPHY_TOKENS } from './typography-token'
import { FontConfigType, FontWeightKey } from './utils'

const { ROOT_FONT_SIZE, BASE_FONT_SIZE, BASE_LINE_HEIGHT } = Config.get('theme')

const FONT_FAMILY_PROPS = resolveFontFamilyProps()

function getMappedFontFamily<K extends FontConfigType, FW extends FontWeightKey<K>>(
    fontType: K,
    fontWeight: FW,
) {
    return FONT_FAMILY_PROPS[fontType][fontWeight]
}

export const typography = {
    root: {
        ...getMappedFontFamily('body', 400),
        ...resolveSizeProps(ROOT_FONT_SIZE, BASE_LINE_HEIGHT),
        letterSpacing: 0,
        textTransform: 'none',
    },
    display01: {
        ...getMappedFontFamily('display', 600),
        ...resolveSizeProps(64, 1.125),
        letterSpacing: 0.64,
        textTransform: 'none',
    },
    display02: {
        ...getMappedFontFamily('display', 600),
        ...resolveSizeProps(56, 1.125),
        letterSpacing: 0.64,
        textTransform: 'none',
    },
    display03: {
        ...getMappedFontFamily('display', 600),
        ...resolveSizeProps(44, 1.125),
        letterSpacing: 0.64,
        textTransform: 'none',
    },
    display04: {
        ...getMappedFontFamily('display', 600),
        ...resolveSizeProps(36, 1.125),
        letterSpacing: 0.64,
        textTransform: 'none',
    },
    h1: {
        ...getMappedFontFamily('display', 700),
        ...resolveSizeProps(32, 1.125),
        letterSpacing: 0.64,
        textTransform: 'none',
    },
    h2: {
        ...getMappedFontFamily('display', 600),
        ...resolveSizeProps(24, 1.2),
        letterSpacing: 0,
        textTransform: 'none',
    },
    h3: {
        ...getMappedFontFamily('display', 600),
        ...resolveSizeProps(20, 1.2),
        letterSpacing: 0,
        textTransform: 'none',
    },
    h4: {
        ...getMappedFontFamily('display', 600),
        ...resolveSizeProps(18, 1.2),
        letterSpacing: 0,
        textTransform: 'none',
    },
    h5: {
        ...getMappedFontFamily('display', 600),
        ...resolveSizeProps(ROOT_FONT_SIZE),
        letterSpacing: 0,
        textTransform: 'none',
    },
    h6: {
        ...getMappedFontFamily('display', 600),
        ...resolveSizeProps(BASE_FONT_SIZE),
        letterSpacing: 0,
        textTransform: 'none',
    },
    cardTitle: {
        ...getMappedFontFamily('display', 600),
        ...resolveSizeProps(20, 1.4),
        letterSpacing: 0,
        textTransform: 'none',
    },
    lead: {
        ...getMappedFontFamily('display', 400),
        ...resolveSizeProps(24),
        letterSpacing: 0.32,
        textTransform: 'none',
    },
    leadBold: {
        ...getMappedFontFamily('display', 700),
        ...resolveSizeProps(24),
        letterSpacing: 0.32,
        textTransform: 'none',
    },
    body: {
        ...getMappedFontFamily('body', 400),
        ...resolveSizeProps(ROOT_FONT_SIZE),
        letterSpacing: 0,
        textTransform: 'none',
    },
    bodyMedium: {
        ...getMappedFontFamily('body', 500),
        ...resolveSizeProps(BASE_FONT_SIZE),
        letterSpacing: 0,
        textTransform: 'none',
    },
    bodySemiBold: {
        ...getMappedFontFamily('body', 600),
        ...resolveSizeProps(BASE_FONT_SIZE),
        letterSpacing: 0,
        textTransform: 'none',
    },
    bodyBold: {
        ...getMappedFontFamily('body', 700),
        ...resolveSizeProps(ROOT_FONT_SIZE),
        letterSpacing: 0,
        textTransform: 'none',
    },
    bodySmall: {
        ...getMappedFontFamily('body', 400),
        ...resolveSizeProps(BASE_FONT_SIZE),
        letterSpacing: 0,
        textTransform: 'none',
    },
    bodySmallMedium: {
        ...getMappedFontFamily('body', 500),
        ...resolveSizeProps(BASE_FONT_SIZE),
        letterSpacing: 0,
        textTransform: 'none',
    },
    bodySmallSemiBold: {
        ...getMappedFontFamily('body', 600),
        ...resolveSizeProps(BASE_FONT_SIZE),
        letterSpacing: 0,
        textTransform: 'none',
    },
    bodySmallBold: {
        ...getMappedFontFamily('body', 700),
        ...resolveSizeProps(BASE_FONT_SIZE),
        letterSpacing: 0,
        textTransform: 'none',
    },
    bodyLarge: {
        ...getMappedFontFamily('body', 400),
        ...resolveSizeProps(ROOT_FONT_SIZE * 1.125),
        letterSpacing: 0,
        textTransform: 'none',
    },
    bodyLargeMedium: {
        ...getMappedFontFamily('body', 500),
        ...resolveSizeProps(ROOT_FONT_SIZE * 1.125),
        letterSpacing: 0,
        textTransform: 'none',
    },
    bodyLargeSemiBold: {
        ...getMappedFontFamily('body', 600),
        ...resolveSizeProps(ROOT_FONT_SIZE * 1.125),
        letterSpacing: 0,
        textTransform: 'none',
    },
    bodyLargeBold: {
        ...getMappedFontFamily('body', 700),
        ...resolveSizeProps(ROOT_FONT_SIZE * 1.125),
        letterSpacing: 0,
        textTransform: 'none',
    },
    detail: {
        ...getMappedFontFamily('body', 400),
        ...resolveSizeProps(12),
        letterSpacing: 0,
        textTransform: 'none',
    },
    detailMedium: {
        ...getMappedFontFamily('body', 500),
        ...resolveSizeProps(12),
        letterSpacing: 0,
        textTransform: 'none',
    },
    detailSemiBold: {
        ...getMappedFontFamily('body', 600),
        ...resolveSizeProps(12),
        letterSpacing: 0,
        textTransform: 'none',
    },
    detailBold: {
        ...getMappedFontFamily('body', 700),
        ...resolveSizeProps(12),
        letterSpacing: 0,
        textTransform: 'none',
    },
    label: {
        ...getMappedFontFamily('display', 600),
        ...resolveSizeProps(BASE_FONT_SIZE),
        letterSpacing: 0,
        textTransform: 'none',
    },
    labelSmall: {
        ...getMappedFontFamily('display', 600),
        ...resolveSizeProps(13, 19.5),
        letterSpacing: 0,
        textTransform: 'none',
    },
    linkText: {
        ...getMappedFontFamily('display', 600),
        ...resolveSizeProps(ROOT_FONT_SIZE),
        letterSpacing: 0,
        textTransform: 'none',
    },
    caption: {
        ...getMappedFontFamily('display', 500),
        ...resolveSizeProps(12, 16),
        letterSpacing: 0,
        textTransform: 'none',
    },
    captionBold: {
        ...getMappedFontFamily('display', 700),
        ...resolveSizeProps(12, 16),
        letterSpacing: 0,
        textTransform: 'none',
    },
    code: {
        ...getMappedFontFamily('code', 400),
        ...resolveSizeProps(13),
        letterSpacing: 0,
        textTransform: 'none',
    },
    codeBold: {
        ...getMappedFontFamily('code', 700),
        ...resolveSizeProps(13),
        letterSpacing: 0,
        textTransform: 'none',
    },
    address: {
        ...getMappedFontFamily('body', 400),
        ...resolveSizeProps(BASE_FONT_SIZE),
        letterSpacing: 0,
        textTransform: 'none',
    },
    overline: {
        ...getMappedFontFamily('display', 700),
        ...resolveSizeProps(BASE_FONT_SIZE),
        letterSpacing: 0,
        textTransform: 'uppercase',
    },
    overlineSmall: {
        ...getMappedFontFamily('display', 700),
        ...resolveSizeProps(12),
        letterSpacing: 0,
        textTransform: 'uppercase',
    },
}

if (JSON.stringify(Object.keys(typography)) !== JSON.stringify(TYPOGRAPHY_TOKENS)) {
    throw new Error(
        'The number of typography definitions is out of sync with the number of TYPOGRAPHY_TOKENS',
    )
}

// export type TypographyToken = keyof typeof typography
