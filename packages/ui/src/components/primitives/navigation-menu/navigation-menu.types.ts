import type {
    ForceMountable,
    PositionedContentProps,
    SlottablePressableProps,
    SlottableViewProps,
} from '../types'

type RootProps = SlottableViewProps & {
    value: string | undefined
    onValueChange: (value: string | undefined) => void
    /**
     * Platform: WEB ONLY
     */
    delayDuration?: number
    /**
     * Platform: WEB ONLY
     */
    skipDelayDuration?: number
    /**
     * Platform: WEB ONLY
     */
    dir?: 'ltr' | 'rtl'
    /**
     * Platform: WEB ONLY
     */
    orientation?: 'horizontal' | 'vertical'
}

type ItemProps = SlottableViewProps & {
    value: string | undefined
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

type LinkProps = SlottablePressableProps & {
    active?: boolean
}

type ListProps = SlottableViewProps
type TriggerProps = SlottablePressableProps
type ContentProps = SlottableViewProps & PositionedContentProps
type IndicatorProps = SlottableViewProps
type ViewportProps = Omit<SlottableViewProps, 'children'>

export type {
    ContentProps,
    IndicatorProps,
    ItemProps,
    LinkProps,
    ListProps,
    PortalProps,
    RootProps,
    TriggerProps,
    ViewportProps,
}
