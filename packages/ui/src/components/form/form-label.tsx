import React, { useMemo } from 'react'

import { Color } from '@ui/theme'

import { Icon, type IconName } from '../icon'
import { Stack, StackProps } from '../layout/stack'
import { Text, type TextProps } from '../text'

type LabelProps = TextProps & {
    accessibilityLabel?: string
    accessibilityHint?: string
    // Stack-/text-alignment
    align?: StackProps['align']
    icon?: IconName
    iconSize?: number
    iconColor?: Color
    iconLocation?: 'start' | 'end' // default 'start'
    showRequiredAsterisk?: boolean
    // Layout the label atop the input field
    stackLabel?: boolean
}

export const FormLabel = ({
    children,
    accessibilityLabel,
    accessibilityHint,
    align = 'center',
    icon,
    iconSize = 24,
    iconColor = 'fgMuted',
    iconLocation = 'start',
    showRequiredAsterisk,
    stackLabel = false,
    ...props
}: React.PropsWithChildren<LabelProps>) => {
    const layoutAxis = useMemo(() => (`${stackLabel}` === 'true' ? 'y' : 'x'), [stackLabel])

    return (
        <Stack axis={layoutAxis} spacing="xs" align={align}>
            {icon && iconLocation !== 'end' && (
                <Icon name={icon} size={iconSize} color={iconColor} />
            )}
            <Text
                {...props}
                variant={showRequiredAsterisk ? 'label' : 'body'}
                color={showRequiredAsterisk ? 'fg' : 'critical.fg'}
                numberOfLines={showRequiredAsterisk ? 1 : undefined}
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
            >
                {children}
                {showRequiredAsterisk && '*'}
            </Text>
            {icon && iconLocation === 'end' && (
                <Icon name={icon} size={iconSize} color={iconColor} />
            )}
        </Stack>
    )
}

FormLabel.displayName = 'FormLabel'
