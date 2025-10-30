import type {
    ForceMountable,
    PositionedContentProps,
    SlottablePressableProps,
    SlottableViewProps,
} from '../types'

type RootProps = SlottableViewProps & {
    onOpenChange?: (open: boolean) => void
    /**
     * Platform: WEB ONLY
     * @default 700
     */
    delayDuration?: number
    /**
     * Platform: WEB ONLY
     * @default 300
     */
    skipDelayDuration?: number
    /**
     * Platform: WEB ONLY
     */
    disableHoverableContent?: boolean
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

type ContentProps = SlottableViewProps &
    Omit<PositionedContentProps, 'side'> & {
        /**
         * `left` and `right` are only supported on web.
         */
        side?: 'top' | 'right' | 'bottom' | 'left'
    }

type TriggerProps = SlottablePressableProps

export type { ContentProps, OverlayProps, PortalProps, RootProps, TriggerProps }
