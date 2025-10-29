import type {
    ForceMountable,
    PositionedContentProps,
    SlottablePressableProps,
    SlottableViewProps,
} from '../../../types/react-native.types'

interface SharedRootContext {
    open: boolean
    onOpenChange: (value: boolean) => void
    openDelay?: number
    closeDelay?: number
}

type RootProps = SlottableViewProps & {
    onOpenChange?: (open: boolean) => void
    /**
     * Platform: WEB ONLY
     * @default 700
     */
    openDelay?: number
    /**
     * Platform: WEB ONLY
     * @default 300
     */
    closeDelay?: number
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
        closeOnPress?: boolean
    }

type TriggerProps = SlottablePressableProps
type ContentProps = SlottableViewProps & PositionedContentProps

export type { ContentProps, OverlayProps, PortalProps, SharedRootContext, RootProps, TriggerProps }
