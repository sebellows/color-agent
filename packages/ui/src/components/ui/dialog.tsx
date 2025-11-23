import * as React from 'react'
import { Platform, StyleProp, View, ViewStyle } from 'react-native'

import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

import { getBorder, typography } from '../../design-system/design-system.utils'
import { RNView } from '../../types'
import * as DialogPrimitive from '../primitives/dialog'
import { Icon } from './icon'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlayWeb = ({ ref, style, ...props }: DialogPrimitive.OverlayProps) => {
    const { open } = DialogPrimitive.useRootContext()

    return (
        <DialogPrimitive.Overlay
            style={[styles.overlay, styles.overlayWeb({ open }), style as StyleProp<ViewStyle>]}
            {...props}
            ref={ref}
        />
    )
}

DialogOverlayWeb.displayName = 'DialogOverlayWeb'

const DialogOverlayNative = ({ ref, style, children, ...props }: DialogPrimitive.OverlayProps) => {
    return (
        <DialogPrimitive.Overlay
            style={[styles.overlay, style as StyleProp<ViewStyle>]}
            {...props}
            ref={ref}
        >
            <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(150)}>
                <>{children}</>
            </Animated.View>
        </DialogPrimitive.Overlay>
    )
}

DialogOverlayNative.displayName = 'DialogOverlayNative'

const DialogOverlay = Platform.select({
    web: DialogOverlayWeb,
    default: DialogOverlayNative,
})

const DialogContent = ({
    ref,
    border,
    style,
    children,
    portalHost,
    ...props
}: DialogPrimitive.ContentProps & { border?: boolean; portalHost?: string }) => {
    const { open } = DialogPrimitive.useRootContext()
    return (
        <DialogPortal hostName={portalHost}>
            <DialogOverlay>
                <DialogPrimitive.Content
                    ref={ref}
                    style={[styles.content({ border }), style]}
                    {...props}
                >
                    {children}
                    <DialogPrimitive.Close style={styles.closeBtn}>
                        <Icon
                            name="x"
                            size={Platform.OS === 'web' ? 16 : 18}
                            color={open ? 'accent.bg' : 'fgMuted'}
                        />
                    </DialogPrimitive.Close>
                </DialogPrimitive.Content>
            </DialogOverlay>
        </DialogPortal>
    )
}
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ style, ...props }: React.ComponentPropsWithRef<RNView>) => (
    <View style={[styles.header, style]} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ ref, style, ...props }: React.ComponentPropsWithRef<RNView>) => (
    <View style={[styles.footer, style]} {...props} />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = ({ ref, style, ...props }: DialogPrimitive.TitleProps) => (
    <DialogPrimitive.Title ref={ref} style={[styles.title, style]} {...props} />
)
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = ({ ref, style, ...props }: DialogPrimitive.DescriptionProps) => (
    <DialogPrimitive.Description ref={ref} style={[styles.description, style]} {...props} />
)
DialogDescription.displayName = DialogPrimitive.Description.displayName

const styles = StyleSheet.create(theme => ({
    title: {
        ...typography(theme, 'h3'),
        color: theme.colors.fg,
        letterSpacing: -0.025,
    },
    description: {
        ...typography(theme, 'bodySmall'),
        color: theme.colors.fgMuted,
    },
    closeBtn: {
        position: 'absolute',
        top: theme.space.md,
        right: theme.space.md,
        padding: theme.space.px,
        borderRadius: theme.radii.sm,
        opacity: 0.7,
        _web: {
            transitionProperty: 'opacity',
            _hover: {
                opacity: 1.0,
            },
            _focus: {
                outline: 'none',
            },
            _disabled: {
                pointerEvents: 'none',
            },
        },
    },
    header: {
        // 'flex flex-col gap-1.5 text-center sm:text-left'
        display: 'flex',
        flexDirection: 'column',
        gap: theme.gap(1.5),
        textAlign: {
            xs: 'center',
            sm: 'left',
        },
    },
    footer: {
        // 'flex flex-col-reverse sm:flex-row sm:justify-end gap-2'
        display: 'flex',
        flexDirection: {
            xs: 'column-reverse',
            sm: 'row',
        },
        gap: theme.gap(2),
    },
    overlay: {
        // 'bg-black/80 flex justify-center items-center p-2 absolute top-0 right-0 bottom-0 left-0',
        // open ? 'web:animate-in web:fade-in-0' : 'web:animate-out web:fade-out-0'
        backgroundColor: theme.colors.bgOverlay,
        padding: theme.space.default,
        ...theme.utils.flexCenter,
        ...theme.utils.absoluteFill,
    },
    overlayWeb: ({ open }) => ({
        _web: {
            _classNames: open ? 'fade-in' : 'fade-out',
        },
    }),
    content: ({ border, open }) => ({
        color: theme.colors.bg,
        gap: theme.gap(4),
        maxWidth: theme.containers.lg,
        padding: theme.space.lg,
        boxShadow: theme.boxShadows.lg,
        borderRadius: theme.radii.lg,
        ...getBorder(theme, border),

        _web: {
            _classNames:
                open ?
                    ['fade-in', 'zoom-in', 'zoom-in-95']
                :   ['fade-out', 'zoom-out', 'zoom-out-95'],
        },
    }),
}))

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
}
