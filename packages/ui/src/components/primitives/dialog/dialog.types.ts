import type {
    ForceMountable,
    SlottablePressableProps,
    SlottableTextProps,
    SlottableViewProps,
} from '../types'

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
        onOpenAutoFocus?: (event: Event) => void
        /**
         * Platform: WEB ONLY
         */
        onCloseAutoFocus?: (event: Event) => void
        /**
         * Platform: WEB ONLY
         */
        onEscapeKeyDown?: (event: Event) => void
        /**
         * Platform: WEB ONLY
         */
        onInteractOutside?: (event: Event) => void
        /**
         * Platform: WEB ONLY
         */
        onPointerDownOutside?: (event: Event) => void
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
