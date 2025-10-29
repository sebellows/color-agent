import type {
    ForceMountable,
    PositionedContentProps,
    SlottablePressableProps,
    SlottableViewProps,
} from '../../../types/react-native.types'

type RootProps = SlottableViewProps & { onOpenChange?: (open: boolean) => void }
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
type ContentProps = SlottableViewProps &
    PositionedContentProps & {
        /**
         * Platform: WEB ONLY
         */
        onOpenAutoFocus?: (event: Event) => void
    }
type CloseProps = SlottablePressableProps

export type { CloseProps, ContentProps, OverlayProps, PortalProps, RootProps, TriggerProps }
