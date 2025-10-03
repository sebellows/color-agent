import { BoxShadowValue, View } from 'react-native'

import { getShadow, type Color } from '@ui/theme'
import { announceForAccessibility } from '@ui/utils/a11y'
import { haptics } from '@ui/utils/haptics'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ToastContainer, { type ToastConfigParams } from 'react-native-toast-message'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { Icon, IconButton, Stack, Text } from './primitives'
import { type IconName } from './primitives/icon'

type Variant = 'info' | 'positive' | 'warning' | 'critical'

type Props = ToastConfigParams<{
    icon?: IconName
}>

const toastConfig = {
    success: ({ text1, text2, props }: Props) => (
        <Toast variant="positive" title={text1 || ''} subtitle={text2} icon={props?.icon} />
    ),
    warn: ({ text1, text2, props }: Props) => (
        <Toast variant="warning" title={text1 || ''} subtitle={text2} icon={props?.icon} />
    ),
    error: ({ text1, text2, props }: Props) => (
        <Toast variant="critical" title={text1 || ''} subtitle={text2} icon={props?.icon} />
    ),
    info: ({ text1, text2, props }: Props) => (
        <Toast variant="info" title={text1 || ''} subtitle={text2} icon={props?.icon} />
    ),
}

export default function Toaster() {
    const { theme } = useUnistyles()
    const insets = useSafeAreaInsets()
    const topOffset = insets.top + theme.space.sm

    return <ToastContainer config={toastConfig} topOffset={topOffset} />
}

export function showToast({
    title,
    subtitle,
    icon,
    type,
}: {
    title: string
    subtitle?: string
    icon?: IconName
    type: Variant
}) {
    getHaptic(type)()
    ToastContainer.show({
        text1: title,
        text2: subtitle,
        props: { icon },
        type,
    })

    announceForAccessibility({
        message: `${type} toast: ${title}${subtitle ? `, ${subtitle}` : ''}`,
    })
}

function getHaptic(type: Variant) {
    switch (type) {
        case 'info':
            return haptics.impactLight
        case 'warning':
            return haptics.notificationWarning
        case 'critical':
            return haptics.notificationError
        case 'positive':
            return haptics.notificationSuccess
        default:
            return haptics.impactLight
    }
}

function Toast({
    title,
    subtitle,
    variant,
    icon,
}: {
    title: string
    subtitle?: string
    variant: Variant
    icon?: IconName
}) {
    const color = variantToColor[variant]
    const iconName = icon || variantToIcon[variant]
    const hasIcon = !!iconName

    function onClose() {
        ToastContainer.hide()
    }

    styles.useVariants({ hasIcon })

    return (
        <View style={styles.toastWrapper}>
            <Stack axis="x" spacing="sm" align="center">
                {hasIcon && <Icon name={iconName} size={24} color={color} />}

                <Stack axis="y" spacing="xs" align="center">
                    <Text variant="bodySmall" color={color}>
                        {title}
                    </Text>

                    {!!subtitle && (
                        <Text variant="detail" color="textMuted">
                            {subtitle}
                        </Text>
                    )}
                </Stack>
                <IconButton variant="plain" icon={'x' as IconName} onPress={onClose} />
            </Stack>
        </View>
    )
}

const variantToColor: { [variant in Variant]: Color } = {
    info: 'infoContrast',
    warning: 'warnContrast',
    critical: 'errorContrast',
    positive: 'successContrast',
}

const variantToIcon: { [variant in Variant]?: IconName } = {
    info: 'info' as IconName,
    warning: 'warning' as IconName,
    critical: 'error' as IconName,
    positive: 'checkCircle' as IconName,
}

const styles = StyleSheet.create(theme => ({
    toastWrapper: {
        borderRadius: theme.radii.full,
        paddingVertical: theme.space.default,
        paddingHorizontal: theme.space.md,
        backgroundColor: theme.utils.getColor('bg'),
        boxShadow: getShadow(theme, 'soft2'),
        variants: {
            hasIcon: {
                true: { paddingLeft: theme.space.default },
                false: { paddingLeft: theme.space.lg },
            },
        },
    },
}))
