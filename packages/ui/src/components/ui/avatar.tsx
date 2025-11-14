import { StyleSheet } from 'react-native-unistyles'

import { getSizeVariants } from '../../design-system/design-system.utils'
import * as AvatarPrimitive from '../primitives/avatar'

const Avatar = ({ ref, size, style, ...props }: AvatarPrimitive.RootProps) => {
    styles.useVariants({
        size,
    })

    return <AvatarPrimitive.Root ref={ref} style={[styles.avatar, style]} {...props} />
}
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = ({ ref, style, ...props }: AvatarPrimitive.ImageProps) => (
    <AvatarPrimitive.Image ref={ref} style={[styles.image, style]} {...props} />
)
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = ({ ref, style, ...props }: AvatarPrimitive.FallbackProps) => (
    <AvatarPrimitive.Fallback ref={ref} style={[styles.fallback, style]} {...props} />
)
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

const styles = StyleSheet.create(theme => ({
    avatar: {
        borderRadius: theme.radii.full,
        overflow: 'hidden',
        variants: {
            size: getSizeVariants(),
        },
    },
    image: {
        width: '100%',
        height: '100%',
        aspectRatio: '1 / 1',
    },
    fallback: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.bgMuted,
    },
}))

export { Avatar, AvatarFallback, AvatarImage }
