import { SpacingProps, SpacingShorthandProps, LayoutProps } from '@shopify/restyle'

import { getEntries } from '@coloragent/utils'
import { Theme } from '@ui/theme/native'
import { PlatformEnv } from '@ui/types'

type ParsedSpacingProps = SpacingProps<Theme> & SpacingShorthandProps<Theme> & LayoutProps<Theme>

export function spacingStyleResolver(
    platform: PlatformEnv,
): (spacingProps: SpacingProps<Theme> & SpacingShorthandProps<Theme>) => ParsedSpacingProps {
    function resolveSpacingStyles(
        spacingProps: SpacingProps<Theme> & SpacingShorthandProps<Theme>,
    ): ParsedSpacingProps {
        const init: SpacingProps<Theme> & SpacingShorthandProps<Theme> & LayoutProps<Theme> = {}

        return getEntries(spacingProps).reduce((acc, [key, value]) => {
            if (value == null) return acc
            if (typeof value === 'string' && (value === 'auto' || value === 'none')) {
                if (platform === 'mobile') {
                    acc.justifyContent = 'center'
                } else {
                    acc[key] = value
                }
                return acc
            }
            return acc
        }, init)
    }

    return resolveSpacingStyles
}
