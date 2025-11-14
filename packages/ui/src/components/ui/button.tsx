import * as React from 'react'
import { Pressable } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { RNPressable } from '../../types'
import { TextStyleContext } from './text'

const buttonStyles = StyleSheet.create(theme => ({
    button: ({ disabled }) => ({
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radii.md,
        opacity: disabled ? 0.5 : 1,
        _web: {
            cursor: disabled ? 'not-allowed' : 'pointer',
            pointerEvents: disabled ? 'none' : 'auto',
        },
        variants: {
            variant: {
                default: {
                    backgroundColor: theme.colors.primary,
                    _web: {
                        ':hover': {
                            opacity: 0.9,
                        },
                        ':active': {
                            opacity: 0.9,
                        },
                    },
                },
                critical: {
                    backgroundColor: theme.colors.critical.bg,
                    _web: {
                        ':hover': {
                            opacity: 0.9,
                        },
                        ':active': {
                            opacity: 0.9,
                        },
                    },
                },
                outline: {
                    borderWidth: 1,
                    borderColor: theme.colors.primary.line4,
                    backgroundColor: theme.colors.bg,
                    color: theme.colors.primary.fg,
                    _web: {
                        ':hover': {
                            backgroundColor: theme.colors.accent.bgHover,
                            color: theme.colors.primary.fg,
                        },
                        ':active': {
                            backgroundColor: theme.colors.primary.bg,
                            color: theme.colors.fg,
                        },
                    },
                },
                accent: {
                    backgroundColor: theme.colors.accent.bg,
                    _web: {
                        ':hover': {
                            opacity: 0.8,
                        },
                        ':active': {
                            opacity: 0.8,
                        },
                    },
                },
                ghost: {
                    _web: {
                        ':hover': {
                            backgroundColor: theme.colors.primary.bgHover,
                            color: theme.colors.primary.fg,
                        },
                        ':active': {
                            backgroundColor: theme.colors.primary.bg,
                        },
                    },
                },
                link: {
                    _web: {
                        textDecorationLine: 'underline',
                        textUnderlineOffset: 4,
                        ':hover': {
                            textDecorationLine: 'underline',
                        },
                        ':focus': {
                            textDecorationLine: 'underline',
                        },
                    },
                },
            },
            size: {
                default: {
                    height: 48,
                    paddingHorizontal: theme.space.md,
                    paddingVertical: theme.space.sm,
                    _web: {
                        height: 40,
                        paddingHorizontal: theme.space.md,
                        paddingVertical: theme.space.default,
                    },
                },
                sm: {
                    height: 36,
                    borderRadius: theme.radii.md,
                    paddingHorizontal: theme.space.sm,
                },
                lg: {
                    height: 56,
                    borderRadius: theme.radii.md,
                    paddingHorizontal: theme.space.xl,
                    _web: {
                        height: 44,
                    },
                },
                icon: theme.utils.getSize(40),
            },
        },
    }),
    text: ({ disabled }) => ({
        pointerEvents: disabled ? 'none' : 'auto',
        ...theme.typography.bodyMedium,
        color: theme.colors.fg,
        _web: {
            ...theme.typography.bodySmallMedium,
            whiteSpace: 'nowrap',
            transition: 'color 0.2s ease-in-out',
        },
        variants: {
            variant: {
                default: {
                    color: theme.colors.primary.fg,
                },
                critical: {
                    color: theme.colors.critical.fg,
                },
                outline: {
                    color: theme.colors.primary.fg,
                },
                accent: {
                    color: theme.colors.accent.fg,
                    _web: {
                        ':hover': {
                            color: theme.colors.accent.fg,
                        },
                        ':active': {
                            color: theme.colors.fg,
                        },
                    },
                },
                ghost: {
                    color: theme.colors.primary.fg,
                    _web: {
                        ':hover': {
                            color: theme.colors.primary.fg,
                        },
                        ':active': {
                            color: theme.colors.fg,
                        },
                    },
                },
                link: {
                    color: theme.colors.primary,
                    _web: {
                        ':hover': {
                            textDecorationLine: 'underline',
                        },
                        ':focus': {
                            textDecorationLine: 'underline',
                        },
                    },
                },
            },
            size: {
                default: {},
                sm: {},
                lg: {
                    ...theme.typography.bodyLargeMedium,
                    _web: theme.typography.bodySmallMedium,
                    icon: {},
                },
            },
        },
    }),
}))

type ButtonProps = React.ComponentPropsWithRef<RNPressable> & {
    variant?: 'default' | 'critical' | 'outline' | 'accent' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = ({ ref, style, variant, size, ...props }: ButtonProps) => {
    return (
        <TextStyleContext.Provider value={buttonStyles.text(props)}>
            <Pressable ref={ref} role="button" style={buttonStyles.button(props)} {...props} />
        </TextStyleContext.Provider>
    )
}

Button.displayName = 'Button'

export { Button, buttonStyles }
export type { ButtonProps }
