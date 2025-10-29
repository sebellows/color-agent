import type {
    ForceMountable,
    SlottablePressableProps,
    SlottableTextProps,
    SlottableViewProps,
} from '../../../types/react-native.types'

type RootContext = {
    open: boolean
    onOpenChange: (value: boolean) => void
}

type RootProps = SlottableViewProps & {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (value: boolean) => void
}

interface PortalProps extends ForceMountable {
    children: React.ReactNode
    /**
     * Platform: NATIVE ONLY
     */
    hostName?: string
    /**
     * Platform: WEB ONLY
     */
    container?: HTMLElement | null | undefined
}

type OverlayProps = ForceMountable &
    SlottablePressableProps & {
        /**
         * Platform: NATIVE ONLY - default: true
         */
        closeOnPress?: boolean
    }

type ContentProps = ForceMountable &
    SlottableViewProps & {
        /**
         * Platform: WEB ONLY
         */
        onOpenAutoFocus?: (ev: Event) => void
        /**
         * Platform: WEB ONLY
         */
        onCloseAutoFocus?: (ev: Event) => void
        /**
         * Platform: WEB ONLY
         */
        onEscapeKeyDown?: (ev: Event) => void
        /**
         * Platform: WEB ONLY
         */
        onInteractOutside?: (ev: Event) => void
        /**
         * Platform: WEB ONLY
         */
        onPointerDownOutside?: (ev: Event) => void
    }

type TriggerProps = SlottablePressableProps
type CloseProps = SlottablePressableProps
type TitleProps = SlottableTextProps
type DescriptionProps = SlottableTextProps

export type {
    CloseProps,
    ContentProps,
    DescriptionProps,
    OverlayProps,
    PortalProps,
    RootContext,
    RootProps,
    TitleProps,
    TriggerProps,
}
