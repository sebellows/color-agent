import { StyleProp, View, ViewStyle } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import {
    getBorder,
    getRingOffsetStyles,
    getSizeVariant,
} from '../../design-system/design-system.utils'
import { isWeb } from '../../utils'
import * as RadioGroupPrimitive from '../primitives/radio-group'

const RadioGroup = ({ ref, style, ...props }: RadioGroupPrimitive.RootProps) => {
    return <RadioGroupPrimitive.Root style={[styles.group, style]} {...props} ref={ref} />
}
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = ({ ref, style, ...props }: RadioGroupPrimitive.ItemProps) => {
    return (
        <RadioGroupPrimitive.Item
            ref={ref}
            style={[styles.item({ disabled: props?.disabled }), style as StyleProp<ViewStyle>]}
            {...props}
        >
            <RadioGroupPrimitive.Indicator style={styles.indicator}>
                <View style={[styles.indicatorInner]} />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    )
}
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

const styles = StyleSheet.create(theme => ({
    group: {
        gap: theme.gap('default'),
        _web: {
            display: 'grid',
        },
    },
    indicator: {
        ...theme.utils.flexCenter,
    },
    indicatorInner: {
        aspectRatio: '1/1',
        backgroundColor: theme.colors.primary.bg,
        borderRadius: theme.radii.full,
        width: isWeb ? 9 : 10,
    },
    item: ({ disabled }) => ({
        ...theme.utils.flexCenter,
        aspectRatio: '1/1',
        ...getSizeVariant(isWeb ? 16 : 20),
        borderRadius: theme.radii.full,
        ...getBorder(theme, true, { borderColor: theme.colors.primary.line4 }),
        color: theme.colors.primary.actionDefault,
        opacity: disabled ? 0.5 : 1,
        _web: {
            ...getRingOffsetStyles(theme),
            _disabled: {
                cursor: 'not-allowed',
            },
        },
    }),
}))

export { RadioGroup, RadioGroupItem }
