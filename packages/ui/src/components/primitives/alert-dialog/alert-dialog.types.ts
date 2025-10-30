import type {
    ForceMountable,
    SlottablePressableProps,
    SlottableTextProps,
    SlottableViewProps,
} from '../types'

type RootProps = {
    open?: boolean
    onOpenChange?: (value: boolean) => void
    defaultOpen?: boolean
} & SlottableViewProps

interface RootContext {
    open: boolean
    onOpenChange: (value: boolean) => void
}

interface PortalProps extends ForceMountable {
    children: React.ReactNode
    /** Platform: NATIVE ONLY */
    hostName?: string
    /** Platform: WEB ONLY */
    container?: HTMLElement | null | undefined
}
type OverlayProps = ForceMountable & SlottableViewProps

type ContentProps = ForceMountable &
    SlottableViewProps & {
        /** Platform: WEB ONLY */
        onOpenAutoFocus?: (event: Event) => void
        /** Platform: WEB ONLY */
        onCloseAutoFocus?: (event: Event) => void
        /** Platform: WEB ONLY */
        onEscapeKeyDown?: (event: Event) => void
    }

type TriggerProps = SlottablePressableProps
type CancelProps = SlottablePressableProps
type ActionProps = SlottablePressableProps
type TitleProps = SlottableTextProps
type DescriptionProps = SlottableTextProps

export type {
    ActionProps,
    CancelProps,
    ContentProps,
    DescriptionProps,
    OverlayProps,
    PortalProps,
    RootContext,
    RootProps,
    TitleProps,
    TriggerProps,
}
