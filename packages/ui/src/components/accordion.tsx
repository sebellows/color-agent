import { useState } from 'react'
import { TouchableOpacity } from 'react-native'

import { Color } from '@ui/theme'
import { haptics } from '@ui/utils/haptics'
import { t } from '@ui/utils/translation'
import Collapsible, { type CollapsibleProps } from 'react-native-collapsible'
import { StyleSheet } from 'react-native-unistyles'

import { Icon, type IconName } from './icon'
import { Stack } from './layout/stack'
import { Text } from './text'

type AccordionProps = Omit<CollapsibleProps, 'collapsed'> & {
    title: string
    initialOpen?: boolean
    children: React.ReactNode
    icon?: IconName
    iconColor?: Color
}

export function Accordion({
    title,
    initialOpen = false,
    children,
    icon,
    iconColor,
    ...rest
}: AccordionProps) {
    const [collapsed, setCollapsed] = useState(!initialOpen)

    function onPress() {
        haptics.selection()
        setCollapsed(p => !p)
    }

    return (
        <Stack axis="y" spacing="sm">
            <TouchableOpacity
                onPress={onPress}
                accessibilityRole="header"
                accessibilityLabel={title}
                accessibilityState={{ expanded: !collapsed }}
                accessibilityHint={
                    collapsed ?
                        t`Double tap to expand the content`
                    :   t`Double tap to collapse the content`
                }
            >
                <AccordionHeader
                    title={title}
                    icon={icon}
                    iconColor={iconColor}
                    collapsed={collapsed}
                />
            </TouchableOpacity>

            <Collapsible {...rest} collapsed={collapsed}>
                {children}
            </Collapsible>
        </Stack>
    )
}

function AccordionHeader({
    title,
    icon,
    iconColor = 'neutral2',
    collapsed,
}: {
    title: string
    icon?: IconName
    iconColor?: Color
    collapsed: boolean
}) {
    return (
        <Stack style={styles.header} axis="x" spacing="sm" align="center" justify="between">
            <Text variant="h4" numberOfLines={1} style={{ flex: 1 }}>
                {title}
            </Text>

            {icon && <Icon name={icon} color={iconColor} size={24} />}

            <Icon name={collapsed ? 'chevron-down' : 'chevron-up'} size={24} />
        </Stack>
    )
}

const styles = StyleSheet.create(theme => ({
    header: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.line3,
        paddingVertical: theme.space.sm,
    },
}))
