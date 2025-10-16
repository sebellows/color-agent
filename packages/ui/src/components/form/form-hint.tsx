import React, { useMemo } from 'react'

import type { Color } from '@ui/theme/theme.types'

import { Icon, type IconName } from '../icon'
import { Stack, StackProps } from '../layout/stack'
import { Text, type TextProps } from '../text'

type Props = TextProps & {
    accessibilityLabel?: string
    accessibilityHint?: string
    // Stack-/text-alignment
    align?: StackProps['align']
    icon?: IconName
    iconSize?: number
    iconColor?: Color
    iconLabel?: string
    hasError?: boolean
    showErrorIcon?: boolean
    name?: string
}

export const FormHint = ({
    children,
    accessibilityLabel,
    accessibilityHint,
    align = 'center',
    color: initialColor = 'fg',
    icon,
    iconSize = 20,
    iconColor = 'fgMuted',
    iconLabel,
    hasError,
    name,
    showErrorIcon = true,
    variant = 'bodySmall',
    ...props
}: React.PropsWithChildren<Props>) => {
    const validationHint = useMemo(() => {
        if (accessibilityHint) return accessibilityHint
        return hasError ?
                `This is an error message for the ${name ?? ''} input field`
            :   `Informational message for the ${name ?? ''} input field`
    }, [accessibilityHint, hasError, name])

    const color = useMemo(() => {
        if (!initialColor && hasError) {
            return 'critical.fg'
        }
        return initialColor
    }, [initialColor, hasError])

    const iconProps = useMemo(() => {
        const _props = {
            name: (icon ?? showErrorIcon ? 'alert-triangle' : 'info') as IconName,
            size: iconSize,
            color: iconColor ?? hasError ? 'critical.fg' : undefined,
            'aria-label': iconLabel ?? showErrorIcon ? 'error' : '',
        }
        return _props
    }, [hasError, icon, iconColor, iconSize])

    return (
        <Stack axis="x" spacing="xs" align={align}>
            {(icon || (hasError && showErrorIcon)) && <Icon {...iconProps} />}
            <Text
                {...props}
                variant={variant}
                color={color}
                accessibilityHint={validationHint}
                accessibilityLabel={accessibilityLabel}
            >
                {children}
            </Text>
        </Stack>
    )
}

FormHint.displayName = 'FormHint'
