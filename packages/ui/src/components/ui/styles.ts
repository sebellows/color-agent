import { CSSProperties, HTMLInputTypeAttribute } from 'react'
import { TextInputProps } from 'react-native'

import { AnyRecord } from '@coloragent/utils'
import { StyleSheet } from 'react-native-unistyles'

import {
    getBorder,
    getColor,
    getPaddingX,
    getPaddingY,
    getRingOffsetStyles,
    getSizeVariant,
    getSpaceValue,
    getWebColor,
    typography,
} from '../../design-system/design-system.utils'
import { SizeToken } from '../../design-system/design-tokens/sizes'
import { StyleValue } from '../../lib/unistyles/stylesheet'
import { Color, Space } from '../../theme/theme.types'
import { isWeb } from '../../utils'
import { SlottableTextProps } from '../primitives/types'
import { ThemeStyleProps, WithThemeStyleProps } from './style.types'
import { resolveThemeProps } from './style.utils'

const DEFAULT_SIZE = (isWeb ? '40' : '48') as SizeToken

type PseudoClass = '_active' | '_focus' | '_hover'

function applyPseudoStyles<Styles extends StyleValue>(
    styles: Styles,
    ...pseudoClasses: ('_active' | '_focus' | '_hover')[]
) {
    if (!pseudoClasses.length) {
        pseudoClasses = ['_active', '_focus', '_hover']
    }
    return pseudoClasses.reduce(
        (acc, pc) => {
            acc[pc] = styles
            return acc
        },
        {} as Record<PseudoClass, Styles>,
    )
}

// type VariantProp = 'color' | 'backgroundColor' | 'borderColor'
// export function stateVariantResolver(
//     theme: UnistylesTheme,
//     color: Color,
//     ...properties: VariantProp[]
// ) {
//     let stateProps: Partial<Record<VariantProp, string>> = {}
//     const _color = getColor(theme, color)
//     if (properties.length < 2) {
//         const [prop = 'color'] = properties
//         stateProps[prop] = _color
//     } else {
//         stateProps = properties.reduce((acc, prop) => {
//             if (
//                 ['primary', 'accent', 'critical', 'neutral', 'positive', 'warning'].includes(color)
//             ) {
//                 switch (prop) {
//                     case 'color':
//                         acc[prop] = getColor(theme, `${color}.fg`)
//                         break
//                     case 'backgroundColor':
//                         acc[prop] = getColor(theme, `${color}.bg`)
//                         break
//                     case 'borderColor':
//                         acc[prop] = getColor(theme, `${color}.line2`)
//                         break
//                 }
//             } else {
//                 acc[prop] = color
//             }
//             return acc
//         }, {})
//     }

//     return {
//         _active: stateProps,
//         _focus: stateProps,
//         _hover: stateProps,
//     }
// }

type SlideProps = {
    open?: boolean
    dir: 'top' | 'right' | 'bottom' | 'left'
    enter?: '80' | 'full' | undefined
    exit?: '80' | 'full' | undefined
}

const itemStyles = StyleSheet.create(theme => ({
    main: ({ disabled, inset, justifyContent = 'center' }) => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent,
        position: 'relative',
        borderRadius: theme.radii.sm,
        gap: theme.gap('default'),
        paddingLeft: inset ? theme.space.default : theme.space.xs,
        paddingRight: theme.space.xs,
        ...getPaddingY(theme, 'xs'),
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
            _hover: {
                backgroundColor: theme.colors.accent.bg,
            },
        },
    }),
    textContext: {
        userSelect: 'none',
        color: theme.colors.componentFg,
        ...typography(theme, isWeb ? 'bodySmall' : 'body'),
        _focus: {
            color: theme.colors.accent.fg,
        },
    },
}))

const triggerStyles = StyleSheet.create(theme => ({
    main: <Props extends WithThemeStyleProps<{ isActive?: boolean }>>({
        border,
        borderColor,
        isActive,
        justifyContent = 'center',
    }: Props) => {
        return {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent,
            ...(border ? getBorder(theme, true, { borderColor }) : {}),
            borderRadius: theme.radii.sm,
            ...getPaddingX(theme, isWeb ? 'sm' : 'md'),
            ...getPaddingY(theme, isWeb ? 'xs' : 'none'),
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
                    backgroundColor: getColor(theme, 'accent.bg') as string,
                    color: getColor(theme, 'accent.fg') as string,
                },
                _focus: {
                    backgroundColor: getColor(theme, 'accent.bg') as string,
                    color: getColor(theme, 'accent.fg') as string,
                },
            },
        }
    },
}))

const subTriggerStyles = StyleSheet.create(theme => ({
    main: ({ open, inset }) => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.gap(2),
        userSelect: 'none',
        backgroundColor: !isWeb && open ? theme.colors.accent.bg : undefined,
        paddingLeft: theme.space[inset ? 'lg' : 'default'],
        paddingRight: theme.space.default,
        ...getPaddingY(theme, isWeb ? 'xxs' : 'default'),
        _web: {
            cursor: 'default',
            outline: 'none',
            ...applyPseudoStyles({ color: getWebColor(theme, 'accent.bg') }),
        },
    }),
    textContext: ({ open }) => ({
        userSelect: 'none',
        color: !isWeb && open ? theme.colors.accent.fg : theme.colors.primary.fg,
        ...typography(theme, isWeb ? 'bodySmall' : 'bodyLarge'),
    }),
}))

const cardStyles = StyleSheet.create(theme => ({
    main: <
        Props extends AnyRecord,
        UiProps extends WithThemeStyleProps<Props> = WithThemeStyleProps<Props>,
    >(
        {
            backgroundColor = 'componentBg',
            border = true,
            borderRadius = 'md',
            boxShadow = 'md',
            ...props
        }: UiProps = {} as UiProps,
    ) => ({
        ...resolveThemeProps(theme, { backgroundColor, border, borderRadius, boxShadow, ...props }),
        overflow: 'hidden',
        minWidth: 128,
    }),
}))

const animatedStyles = StyleSheet.create(_theme => ({
    fadeToggle: ({ active }) => ({
        _web: {
            _classNames: active ? 'fade-in' : 'fade-out',
        },
    }),
    toggle: ({ open }) => ({
        _web: {
            _classNames:
                open ?
                    ['fade-in', 'zoom-in', 'zoom-in-95']
                :   ['fade-out', 'zoom-out', 'zoom-out-95'],
        },
    }),
    toggleSubcontent: ({ open }) => ({
        _web: {
            _classNames:
                open ? ['fade-in', 'zoom-in', 'zoom-in-95'] : ['fade-out', 'zoom-out', 'zoom-out'],
        },
    }),
    slideToggle: ({ open, dir, enter, exit }: SlideProps) => {
        const inSuffix = !enter ? '' : `-${enter}`
        const outSuffix = !exit ? '' : `-${exit}`
        return {
            _web: {
                _classNames:
                    open ?
                        ['fade-in', `slide-in-${dir}${inSuffix}`]
                    :   ['fade-out', `slide-out-${dir}${outSuffix}`],
            },
        }
    },
}))

const popperStyles = StyleSheet.create(theme => ({
    main: ({ usePopper, ref }) => {
        if (usePopper) return {}
        const dataSide = ref.current?.getAttribute?.('data-side')
        let offset: number = 0
        let translate = dataSide === 'left' || dataSide === 'right' ? 'translateX' : 'translateY'
        if (dataSide) {
            if (dataSide === 'left' || dataSide === 'top') {
                offset = getSpaceValue(theme, '-xxs')
            } else {
                offset = getSpaceValue(theme, 'xxs')
            }
        }
        return {
            _web: {
                transform: `${translate}(${offset}px)`,
            },
        }
    },
}))

export type BaseInputProps = WithThemeStyleProps<{
    type?: HTMLInputTypeAttribute
    editable?: boolean
    placeholderTextColor?: TextInputProps['placeholderTextColor']
    isInvalid?: any
    isValid?: boolean
}>

const defaultInputStyles: ThemeStyleProps = {
    backgroundColor: 'componentBg',
    border: true,
    borderRadius: 'md',
    boxShadow: 'md',
    color: 'componentFg',
    display: 'flex',
    height: DEFAULT_SIZE,
    paddingX: 'sm',
    paddingY: 'default',
    ringOffsetColor: 'primary',
    width: 'full',
    zIndex: '50',
    typography: { xs: 'body', lg: 'bodySmall' },
}

const inputStyles = StyleSheet.create(theme => ({
    main: <Props extends BaseInputProps>(props: Props) => {
        const styleProps = { ...defaultInputStyles, ...props }
        const isFile = props?.type === 'file'
        const isEditable = !!props?.editable
        if (styleProps.border && !styleProps.borderColor) {
            const { isValid, isInvalid } = styleProps
            styleProps.borderColor =
                theme.colors[
                    isInvalid ? 'critical.bg'
                    : isValid ? 'positive.bg'
                    : 'line3'
                ]
        }

        return {
            ...resolveThemeProps(theme, styleProps),
            ...(isFile ? { borderWidth: 0, backgroundColor: 'transparent' } : {}),
            ...(isFile && { fontWeight: theme.fontWeights.bodyMedium }),
            opacity: !isEditable ? 0.5 : 1,
            _web: {
                ...(!isEditable && { cursor: 'not-allowed' }),
                ...getRingOffsetStyles(theme, styleProps),
                _placeholder: {
                    color: theme.colors.fgMuted,
                },
            },
        }
    },
}))

const defaultRadioStyles: ThemeStyleProps = {
    borderRadius: 'sm',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 'lg',
    paddingRight: 'xs',
    paddingTop: 'xs',
}

const radioStyles = StyleSheet.create(theme => ({
    main: ({ disabled }: { disabled?: null | boolean | undefined }) => ({
        ...resolveThemeProps(theme, defaultRadioStyles),
        position: 'relative',
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
    indicator: ({ size = '3.5' }: { size?: SizeToken } = {}) => ({
        position: 'absolute',
        left: theme.space.xxs,
        ...theme.utils.flexCenter,
        ...getSizeVariant(size),
    }),
    indicatorInner: ({ color = 'fg', size = '2' }: { color?: Color; size?: SizeToken } = {}) => ({
        backgroundColor: getColor(theme, color),
        borderRadius: theme.radii.full,
        ...getSizeVariant(size),
    }),
}))

const defaultCheckboxStyles: ThemeStyleProps = {
    borderRadius: 'sm',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 'lg',
    paddingRight: 'xs',
    paddingY: isWeb ? 'xs' : 'default',
}

const checkboxStyles = StyleSheet.create(theme => ({
    main: <Props extends WithThemeStyleProps<{ disabled?: boolean | null | undefined }>>({
        disabled,
        ...props
    }: Props) => ({
        ...resolveThemeProps(theme, { ...defaultCheckboxStyles, ...props }),
        position: 'relative',
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
    indicator: ({ size = 14 }: { size?: SizeToken } = {}) => ({
        ...theme.utils.flexCenter,
        position: 'absolute',
        left: theme.space.xxs,
        ...getSizeVariant(size),
    }),
}))

export type UiLabelProps<Props extends SlottableTextProps> = WithThemeStyleProps<WithInset<Props>>

const labelStyles = StyleSheet.create(theme => ({
    main: <Props extends SlottableTextProps>({
        inset,
        padding,
        ...props
    }: UiLabelProps<Props>) => ({
        ...resolveThemeProps(theme, {
            padding: padding ?? {
                top: 'xs',
                right: 'default',
                bottom: 'xs',
                left: inset ? 'lg' : 'default',
            },
            ...props,
        }),
        // paddingLeft: inset ? theme.space.lg : theme.space.default,
        // paddingRight: theme.space.default,
        // ...getPaddingY(theme, 'xs'),
        ...typography(theme, isWeb ? 'bodySmallSemiBold' : 'bodySemiBold'),
        _web: {
            cursor: 'default',
        },
    }),
    wrapper: {
        _web: {
            cursor: 'default',
        },
    },
}))

const separatorStyles = StyleSheet.create(theme => ({
    main: ({ gap = 'xxs' }: { gap?: number | Space } = {}) => {
        const gapAmt = theme.gap(gap)
        return {
            height: 1,
            backgroundColor: theme.colors.line2,
            marginLeft: 0 - gapAmt,
            marginTop: gapAmt,
            marginBottom: gapAmt,
        }
    },
}))

const shortcutStyles = StyleSheet.create(theme => ({
    main: {
        color: theme.colors.fgMuted,
        marginLeft: 'auto',
        ...typography(theme, 'labelSmall'),
    },
}))

const overlayStyles = StyleSheet.create(theme => ({
    main: {
        ...(isWeb ? theme.utils.absoluteFill : {}),
    },
}))

export const uiStyles = {
    /** Web-only animation styles */
    animated: animatedStyles,

    /** Content container styles */
    card: cardStyles,
    content: cardStyles, // alias

    /** Horizontal Rule */
    separator: separatorStyles,

    /** Styles for common child items within a list component */
    item: itemStyles,

    /** Actionable item styles: Select arrow, buttons, etc. */
    trigger: triggerStyles,
    subtrigger: subTriggerStyles,
    shortcut: shortcutStyles,

    /** Form-related styles */
    label: labelStyles,
    checkbox: checkboxStyles,
    input: inputStyles,
    radio: radioStyles,

    /** Overlay background styles */
    overlay: overlayStyles,

    /** 3rd-Party library-related styling */
    popper: popperStyles,
}
