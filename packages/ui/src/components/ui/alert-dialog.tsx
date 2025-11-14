import * as React from 'react'
import { View } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { PropsWithVariant } from '../../types'
import { isWeb } from '../../utils'
import * as AlertDialogPrimitive from '../primitives/alert-dialog'
import { buttonStyles } from './button'
import { TextStyleContext } from './text'

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = ({ ref, style, ...props }: AlertDialogPrimitive.OverlayProps) => {
    const { open } = AlertDialogPrimitive.useRootContext()
    return (
        <AlertDialogPrimitive.Overlay
            style={[styles.overlay({ open }), style]}
            {...props}
            ref={ref}
            asChild={!isWeb}
        />
    )
}
AlertDialogOverlay.displayName = 'AlertDialogOverlay'

const AlertDialogContent = ({
    ref,
    style,
    portalHost,
    ...props
}: AlertDialogPrimitive.ContentProps & { portalHost?: string }) => {
    const { open } = AlertDialogPrimitive.useRootContext()

    return (
        <AlertDialogPortal hostName={portalHost}>
            <AlertDialogOverlay>
                <AlertDialogPrimitive.Content
                    ref={ref}
                    style={[styles.content({ open }), style]}
                    {...props}
                />
            </AlertDialogOverlay>
        </AlertDialogPortal>
    )
}
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({ style, ...props }: React.ComponentPropsWithoutRef<typeof View>) => (
    <View style={[styles.header, style]} {...props} />
)
AlertDialogHeader.displayName = 'AlertDialogHeader'

const AlertDialogFooter = ({ style, ...props }: React.ComponentPropsWithoutRef<typeof View>) => (
    <View style={[styles.footer, style]} {...props} />
)
AlertDialogFooter.displayName = 'AlertDialogFooter'

const AlertDialogTitle = ({ ref, style, ...props }: AlertDialogPrimitive.TitleProps) => (
    <AlertDialogPrimitive.Title ref={ref} style={[styles.title, style]} {...props} />
)
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = ({
    ref,
    style,
    ...props
}: AlertDialogPrimitive.DescriptionProps) => (
    <AlertDialogPrimitive.Description ref={ref} style={[styles.description, style]} {...props} />
)
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

const AlertDialogAction = ({
    ref,
    variant = 'default',
    style,
    ...props
}: PropsWithVariant<AlertDialogPrimitive.ActionProps, typeof buttonStyles, 'button'>) => {
    const textStyle = buttonStyles.text(props)?.[variant]

    return (
        <TextStyleContext.Provider value={textStyle}>
            <AlertDialogPrimitive.Action
                ref={ref}
                style={buttonStyles.button({ ...props, variant })}
                {...props}
            />
        </TextStyleContext.Provider>
    )
}
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = ({
    ref,
    variant = 'outline',
    ...props
}: PropsWithVariant<AlertDialogPrimitive.CancelProps, typeof buttonStyles, 'button'>) => {
    const textStyle = buttonStyles.text(props)?.[variant]

    return (
        <TextStyleContext.Provider value={textStyle}>
            <AlertDialogPrimitive.Cancel
                ref={ref}
                style={buttonStyles.button({ ...props, variant })}
                {...props}
            />
        </TextStyleContext.Provider>
    )
}
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

const styles = StyleSheet.create(theme => ({
    title: {
        ...theme.typography.bodyLargeSemiBold,
        color: theme.colors.fg,
    },
    description: {
        ...theme.typography.bodySmall,
        color: theme.colors.fgMuted,
    },
    header: {
        flexDirection: 'column',
        gap: theme.gap(2),
    },
    footer: {
        display: 'flex',
        flexDirection: {
            xs: 'column-reverse',
            sm: 'row',
        },
        justifyContent: {
            sm: 'flex-end',
        },
        gap: theme.gap(2),
    },
    overlay: ({ open }) => ({
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.space.default,
        zIndex: 50,
        backgroundColor: theme.colors.bgOverlay,
        borderRadius: theme.radii.lg,
        _web: {
            transitionProperty: 'opacity',
            transitionDuration: '150ms',
            opacity: open ? 1 : 0,
        },
    }),
    content: ({ open }) => ({
        width: '100%',
        maxWidth: 512,
        backgroundColor: theme.colors.componentBg,
        borderRadius: theme.radii.lg,
        padding: theme.space.lg,
        gap: theme.gap(4),
        boxShadow: theme.boxShadows.lg,
        _web: {
            outlineStyle: 'none',
            transitionProperty: 'all',
            transitionDuration: '200ms',
            opacity: open ? 1 : 0,
            transform: open ? 'scale(1)' : 'scale(0.95)',
        },
    }),
}))

export {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogPortal,
    AlertDialogTitle,
    AlertDialogTrigger,
}
