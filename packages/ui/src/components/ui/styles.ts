import { HTMLInputTypeAttribute } from 'react'
import { TextInputProps } from 'react-native'

import { isUndefined } from 'es-toolkit'
import { StyleSheet } from 'react-native-unistyles'
import { Simplify } from 'type-fest'

import {
    getBorder,
    getBoxShadow,
    getColor,
    getPadding,
    getRingOffsetStyles,
    getSizeVariant,
    RingOffsetStyleProps,
    typography,
} from '../../design-system/design-system.utils'
import { ShadowToken } from '../../design-system/design-tokens/shadows'
import { SizeToken } from '../../design-system/design-tokens/sizes'
import { ZIndicesToken } from '../../design-system/design-tokens/z-indices'
import { Color, Space, UnistylesTheme } from '../../theme/theme.types'
import { isWeb } from '../../utils'

export type ThemeStyleProps = Simplify<
    {
        border?: boolean | number
        boxShadow?: ShadowToken
        padding?: Space
        size?: SizeToken
        zIndex?: ZIndicesToken
    } & RingOffsetStyleProps
>

const DEFAULT_SIZE = isWeb ? 40 : 48

export function stateVariantResolver(
    theme: UnistylesTheme,
    color: Color,
    property: 'color' | 'backgroundColor' | 'borderColor' = 'color',
) {
    const _color = getColor(theme, color)

    return {
        _active: {
            [property]: _color,
        },
        _focus: {
            [property]: _color,
        },
        _hover: {
            [property]: _color,
        },
    }
}

export const uiStyles = StyleSheet.create(theme => {
    return {
        card: <Props extends ThemeStyleProps>(
            { border = true, boxShadow = 'md', padding, size, zIndex }: Props = {} as Props,
        ) => ({
            // 'z-50 w-64 rounded-md border border-border bg-popover p-4 shadow-md shadow-foreground/5 web:outline-none web:cursor-auto data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            // open
            //   ? 'web:animate-in  web:fade-in-0 web:zoom-in-95'
            //   : 'web:animate-out web:fade-out-0 web:zoom-out-95 ',
            backgroundColor: theme.colors.componentBg,
            borderRadius: theme.radii.md,
            ...getBorder(theme, border),
            ...getBoxShadow(theme, boxShadow),
            overflow: 'hidden',
            padding: !isUndefined(padding) ? theme.space[padding] : undefined,
            zIndex: !isUndefined(zIndex) ? theme.zIndices[zIndex] : undefined,
            minWidth: 128,
            width: !isUndefined(size) ? getSizeVariant(size).width : undefined,
        }),
        input: <Props extends ThemeStyleProps>({
            border = true,
            boxShadow = 'md',
            size = DEFAULT_SIZE,
            zIndex = '50',
            ringOffsetColor,
            ringOffsetWidth,
            ringOpacity,
            ...props
        }: Props & {
            type?: HTMLInputTypeAttribute
            editable?: boolean
            placeholderTextColor?: TextInputProps['placeholderTextColor']
        }) => {
            // 'web:flex h-10 native:h-12 web:w-full rounded-md border border-input bg-background px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
            // props.editable === false && 'opacity-50 web:cursor-not-allowed',
            const isFile = props?.type === 'file'
            const isEditable = !!props?.editable

            return {
                display: 'flex',
                backgroundColor: theme.colors.componentBg,
                borderRadius: theme.radii.md,
                ...(isFile ?
                    { borderWidth: 0, backgroundColor: 'transparent' }
                :   getBorder(theme, border)),
                color: theme.colors.fg,
                ...typography(theme, { xs: 'body', lg: 'bodySmall' }),
                height: getSizeVariant(size).height,
                width: '100%',
                ...getPadding(theme, 'sm', 'left', 'right'),
                ...getPadding(theme, 'default', 'top', 'bottom'),
                ...(isFile && { fontWeight: theme.fontWeights.bodyMedium }),
                opacity: isEditable ? 0.5 : 1,
                _web: {
                    ...(isEditable && { cursor: 'not-allowed' }),
                    '_focus-visible': {
                        outline: 'none',
                        ...getRingOffsetStyles(theme, {
                            ringOffsetColor: 'primary',
                            ringOffsetWidth,
                            ringOpacity,
                        }),
                    },
                    _placeholder: {
                        color: theme.colors.fgMuted,
                    },
                },
            }
        },
        separator: ({ gap = 'xxs' }: { gap?: number | Space } = {}) => {
            const gapAmt = theme.gap(gap)
            return {
                height: 1,
                backgroundColor: theme.colors.line2,
                marginLeft: 0 - gapAmt,
                marginTop: gapAmt,
                marginBottom: gapAmt,
            }
        },
        shortcut: {
            color: theme.colors.fgMuted,
            marginLeft: 'auto',
            ...typography(theme, 'labelSmall'),
        },
        label: ({ inset }) => ({
            paddingLeft: inset ? theme.space.lg : theme.space.default,
            paddingRight: theme.space.default,
            ...getPadding(theme, 'xs', 'top', 'bottom'),
            ...typography(theme, 'bodySmallSemiBold'),
            _web: {
                cursor: 'default',
            },
        }),
        radio: ({ disabled }) => ({
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
            borderRadius: theme.radii.sm,
            paddingLeft: theme.space.lg,
            paddingRight: theme.space.xs,
            paddingTop: theme.space.xs,
            opacity: disabled ? 0.5 : undefined,
            pointerEvents: disabled ? 'none' : undefined,
            _active: {
                backgroundColor: theme.colors.accent.bg,
            },
            _web: {
                cursor: 'default',
                outline: 'none',
                _focus: {
                    backgroundColor: theme.colors.accent.bg,
                },
            },
        }),
        radioIndicator: ({ size = 14 }: { size?: SizeToken } = {}) => ({
            position: 'absolute',
            left: theme.space.xxs,
            ...theme.utils.flexCenter,
            ...getSizeVariant(size),
        }),
        indicatorInner: ({ color = 'fg', size = 8 }: { color?: Color; size?: SizeToken } = {}) => ({
            backgroundColor: getColor(theme, color),
            borderRadius: theme.radii.full,
            ...getSizeVariant(size),
        }),
        checkbox: ({ disabled }) => ({
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
            borderRadius: theme.radii.sm,
            paddingLeft: theme.space.lg,
            paddingRight: theme.space.xs,
            ...getPadding(theme, isWeb ? 'xs' : 'default', 'top', 'bottom'),
            opacity: disabled ? 0.5 : undefined,
            pointerEvents: disabled ? 'none' : undefined,
            _active: {
                backgroundColor: theme.colors.accent.bg,
            },
            _web: {
                cursor: 'default',
                outline: 'none',
                _focus: {
                    backgroundColor: theme.colors.accent.bg,
                },
            },
        }),
        checkboxIndicator: ({ size = 14 }: { size?: SizeToken } = {}) => ({
            ...theme.utils.flexCenter,
            position: 'absolute',
            left: theme.space.xxs,
            ...getSizeVariant(size),
        }),
        item: ({ disabled, inset }) => ({
            ...theme.utils.flexCenter,
            position: 'relative',
            borderRadius: theme.radii.sm,
            gap: theme.gap('default'),
            paddingLeft: inset ? theme.space.default : theme.space.xs,
            paddingRight: theme.space.xs,
            ...getPadding(theme, 'xs', 'top', 'bottom'),
            opacity: disabled ? 0.5 : undefined,
            pointerEvents: disabled ? 'none' : undefined,
            _web: {
                cursor: 'default',
                outline: 'none',
                _active: {
                    backgroundColor: theme.colors.accent.bg,
                },
                _focus: {
                    backgroundColor: theme.colors.accent.bg,
                },
                _hover: {
                    backgroundColor: theme.colors.accent.bg,
                },
            },
        }),
        itemContext: {
            userSelect: 'none',
            color: theme.colors.componentFg,
            ...typography(theme, isWeb ? 'bodySmall' : 'body'),
            _focus: {
                color: theme.colors.accent.fg,
            },
        },
        overlay: {
            ...(isWeb ? theme.utils.absoluteFill : {}),
        },
        subtrigger: ({ open, inset }) => ({
            // 'flex flex-row web:cursor-default web:select-none items-center gap-2 web:focus:bg-accent active:bg-accent web:hover:bg-accent rounded-sm px-2 py-1.5 native:py-2 web:outline-none',
            // open && 'bg-accent', inset && 'pl-8',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.gap(2),
            userSelect: 'none',
            backgroundColor: !isWeb && open ? theme.colors.accent.bg : undefined,
            paddingLeft: theme.space[inset ? 'lg' : 'default'],
            paddingRight: theme.space.default,
            ...getPadding(theme, isWeb ? 'xxs' : 'default', 'top', 'bottom'),
            _web: {
                cursor: 'default',
                outline: 'none',
                ...stateVariantResolver(theme, 'accent.bg'),
            },
        }),
        subtriggerContext: ({ open }) => ({
            // 'select-none text-sm native:text-lg text-primary',
            // open && 'native:text-accent-foreground',
            userSelect: 'none',
            color: !isWeb && open ? theme.colors.accent.fg : theme.colors.primary.fg,
            ...typography(theme, isWeb ? 'bodySmall' : 'bodyLarge'),
        }),
        trigger: ({ isActive }) => ({
            // 'flex flex-row web:cursor-default web:select-none items-center rounded-sm px-3 py-1.5 text-sm native:h-10 native:px-5 native:py-0 font-medium web:outline-none web:focus:bg-accent active:bg-accent web:focus:text-accent-foreground',
            // value === itemValue && 'bg-accent text-accent-foreground',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: theme.radii.sm,
            ...getPadding(theme, isWeb ? 'sm' : 'md', 'left', 'right'),
            ...getPadding(theme, isWeb ? 'xs' : 'none', 'top', 'bottom'),
            ...typography(theme, 'bodySmallMedium'),
            ...(isActive ?
                {
                    backgroundColor: getColor(theme, 'accent.bg'),
                    color: getColor(theme, 'accent.fg'),
                }
            :   {}),
            _web: {
                outline: 'none',
                _active: {
                    backgroundColor: getColor(theme, 'accent.bg'),
                    color: getColor(theme, 'accent.fg'),
                },
                _focus: {
                    backgroundColor: getColor(theme, 'accent.bg'),
                    color: getColor(theme, 'accent.fg'),
                },
            },
        }),
    }
})
