import { assertUnreachable, isDecimal } from '@coloragent/utils'
import { PlatformEnv } from '@ui/types'

const fontMap = {
    web: {
        code: "'Space Mono', monospace",
        body: "'Space Grotesk', sans-serif",
        bodyMedium: "'Space Grotesk', sans-serif",
        bodySemiBold: "'Space Grotesk', sans-serif",
        bodyBold: "'Space Grotesk', sans-serif",
        display: "'Space Grotesk', sans-serif",
        displayMedium: "'Space Grotesk', sans-serif",
        displaySemibold: "'Space Grotesk', sans-serif",
        displayBold: "'Space Grotesk', sans-serif",
    },
    mobile: {
        code: 'SpaceMono-Regular',
        body: 'Noto-Regular',
        bodyMedium: 'Noto-Medium',
        bodySemiBold: 'Noto-SemiBold',
        bodyBold: 'Noto-Bold',
        display: 'SpaceGrotesk-Regular',
        displayMedium: 'SpaceGrotesk-Medium',
        displaySemibold: 'SpaceGrotesk-SemiBold',
        displayBold: 'SpaceGrotesk-Bold',
    },
}

export function getTextVariants({ platform }: { platform: PlatformEnv }) {
    function getFontFamily(family: string) {
        switch (platform) {
            case 'web':
                return fontMap.web[family as keyof typeof fontMap.web]
            case 'mobile':
                return fontMap.mobile[family as keyof typeof fontMap.mobile]
            default:
                return assertUnreachable(platform)
        }
    }

    function normalizeSize<T extends number>(size: T, maxDecimalPlaces: number = 4): string {
        if (isDecimal(size)) {
            const valueStr = size.toString()
            const decimalCount = valueStr.length - valueStr.indexOf('.') - 1
            const precision = decimalCount > maxDecimalPlaces ? maxDecimalPlaces : decimalCount
            return size.toFixed(precision)
        }
        return size.toString()
    }

    function transformFontSize<T extends number>(fontSize: T) {
        switch (platform) {
            case 'web':
                return `${normalizeSize(fontSize)}rem` as const
            case 'mobile':
                return Number(normalizeSize(fontSize))
            default:
                assertUnreachable(platform)
        }
    }

    /**
     * Calculate line height based on font size and scale/multiplier.
     *
     * @param fontSize - The font size in pixels.
     * @param scale - Either a size in pixels or a relative multiplier for line height, default is 1.5.
     * @returns - Returns object defining `fontSize` and `lineHeight`.
     *      For web, both values are returned as a string, otherwise as numbers.
     */
    function resolveSizeProps<T extends number>(size: T, scale: number = 1.5) {
        let lineHeight: number = scale > size ? scale : size * scale
        const fontSize = transformFontSize(size)

        switch (platform) {
            case PlatformEnv.web:
                lineHeight /= size
                if (isDecimal(lineHeight)) {
                    const valueStr = lineHeight.toString()
                    const decimalCount = valueStr.length - valueStr.indexOf('.') - 1
                    const precision = decimalCount > 4 ? 4 : decimalCount
                    return {
                        fontSize,
                        lineHeight: lineHeight.toFixed(precision),
                    }
                }
                return {
                    fontSize,
                    lineHeight: lineHeight.toString(),
                }
            case PlatformEnv.mobile:
                if (isDecimal(lineHeight)) {
                    // Using non-integer pixel values for lineHeight may lead to blurry elements
                    // due to the way React Native handles pixel rounding, so we round it
                    // to the nearest whole integer to make sure it renders crisply.
                    lineHeight = Math.round(lineHeight)
                }
                return {
                    fontSize,
                    lineHeight,
                }
            default:
                assertUnreachable(platform)
        }
    }

    function transformWeight<T extends number>(weight: T) {
        return platform === 'mobile' ? weight.toString() : weight
    }

    const textVariants = {
        display01: {
            fontFamily: getFontFamily('displaySemibold'),
            ...resolveSizeProps(64, 1.125),
            letterSpacing: 0.64,
        },
        display02: {
            fontFamily: getFontFamily('displaySemibold'),
            ...resolveSizeProps(56, 1.125),
            letterSpacing: 0.64,
        },
        display03: {
            fontFamily: getFontFamily('displaySemibold'),
            ...resolveSizeProps(1.125),
            letterSpacing: 0.64,
        },
        display04: {
            fontFamily: getFontFamily('displaySemibold'),
            ...resolveSizeProps(36, 1.125),
            letterSpacing: 0.64,
        },
        heading01: {
            fontFamily: getFontFamily('displayBold'),
            ...resolveSizeProps(36, 1.125),
            fontWeight: transformWeight(700),
            letterSpacing: 0.64,
        },
        heading02: {
            fontFamily: getFontFamily('displaySemiBold'),
            ...resolveSizeProps(24, 1.2),
            fontWeight: transformWeight(700),
        },
        heading03: {
            fontFamily: getFontFamily('displaySemiBold'),
            ...resolveSizeProps(20, 1.2),
            fontWeight: transformWeight(600),
        },
        heading04: {
            fontFamily: getFontFamily('displaySemiBold'),
            ...resolveSizeProps(18, 1.2),
            fontWeight: transformWeight(600),
        },
        heading05: {
            fontFamily: getFontFamily('displaySemiBold'),
            ...resolveSizeProps(16),
            fontWeight: transformWeight(600),
        },
        heading06: {
            fontFamily: getFontFamily('displaySemiBold'),
            ...resolveSizeProps(14, 20), // 20px / 14px = 1.42857
            fontWeight: transformWeight(600),
        },
        cardTitle: {
            fontFamily: getFontFamily('displaySemiBold'),
            ...resolveSizeProps(20, 28),
            fontWeight: transformWeight(600),
        },
        body01: {
            fontFamily: getFontFamily('body'),
            ...resolveSizeProps(16),
            fontWeight: transformWeight(400),
        },
        body02: {
            fontFamily: getFontFamily('body'),
            ...resolveSizeProps(14, 20),
            fontWeight: transformWeight(400),
        },
        detail: {
            fontFamily: getFontFamily('body'),
            ...resolveSizeProps(14, 20),
            fontWeight: transformWeight(400),
        },
        label01: {
            fontFamily: getFontFamily('displaySemiBold'),
            ...resolveSizeProps(14, 20),
            fontWeight: transformWeight(400),
        },
        label02: {
            fontFamily: getFontFamily('displayMedium'),
            ...resolveSizeProps(13, 19.5),
            fontWeight: transformWeight(400),
        },
        caption: {
            fontFamily: getFontFamily('bodyMedium'),
            ...resolveSizeProps(12, 16),
            fontWeight: transformWeight(500),
        },
        code: {
            fontFamily: getFontFamily('code'),
            ...resolveSizeProps(13, 18),
            fontWeight: transformWeight(400),
        },
        address: {
            fontFamily: getFontFamily('bodyMedium'),
            ...resolveSizeProps(14, 21),
            fontWeight: transformWeight(500),
        },
    }

    return textVariants
}
