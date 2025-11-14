import { StyleProp, ViewStyle } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import * as CheckboxPrimitive from '../primitives/checkbox'
import { Icon } from './icon'

const Checkbox = ({ ref, style, ...props }: CheckboxPrimitive.RootProps) => {
    return (
        <CheckboxPrimitive.Root
            ref={ref}
            style={[styles.container(props), style as StyleProp<ViewStyle>]}
            {...props}
        >
            <CheckboxPrimitive.Indicator style={styles.indicator}>
                <Icon name="check" size={12} color="fg" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
}
Checkbox.displayName = CheckboxPrimitive.Root.displayName

const styles = StyleSheet.create(theme => ({
    container: ({ checked, disabled }: CheckboxPrimitive.RootProps) => ({
        borderWidth: 1,
        borderColor: theme.utils.getColor('primary.bg'),
        borderRadius: theme.radii.default,
        opacity: disabled ? 0.5 : undefined,
        flexShrink: 0,
        backgroundColor: checked ? theme.colors.primary.bg : undefined,
        ...theme.utils.getSize(20),
        _web: {
            borderRadius: theme.radii.sm,
            cursor: disabled ? 'not-allowed' : 'initial',
            boxShadow: `0 0 0 0 ${theme.colors.bg}`,
            '_focus-visible': {
                outline: 'none',
                boxShadow: `0 0 0 2px ${theme.colors.primary.focusRing}`,
            },
        },
    }),
    indicator: {
        width: '100%',
        height: '100%',
        ...theme.utils.flexCenter,
    },
}))

export { Checkbox }
