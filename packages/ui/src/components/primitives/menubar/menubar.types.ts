import {
    ForceMountable,
    PositionedContentProps,
    SlottablePressableProps,
    SlottableTextProps,
    SlottableViewProps,
} from '../types'

type RootProps = SlottableViewProps & {
    value: string | undefined
    onValueChange: (value: string | undefined) => void
}

type MenuProps = SlottableViewProps & {
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

type OverlayProps = ForceMountable &
    SlottablePressableProps & {
        closeOnPress?: boolean
    }

type ItemProps = SlottablePressableProps & {
    textValue?: string
    closeOnPress?: boolean
}

type CheckboxItemProps = SlottablePressableProps & {
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    closeOnPress?: boolean
    textValue?: string
}

type RadioGroupProps = SlottableViewProps & {
    value: string | undefined
    onValueChange: (value: string) => void
}

type RadioItemProps = SlottablePressableProps & {
    value: string
    textValue?: string
    closeOnPress?: boolean
}

type SeparatorProps = SlottableViewProps & {
    decorative?: boolean
}

type SubProps = SlottableViewProps & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (value: boolean) => void
}

type SubTriggerProps = SlottablePressableProps & {
    textValue?: string
}

type TriggerProps = SlottablePressableProps
type ContentProps = SlottableViewProps & PositionedContentProps
type SubContentProps = SlottableViewProps & ForceMountable
type ItemIndicatorProps = SlottableViewProps & ForceMountable
type GroupProps = SlottableViewProps
type LabelProps = SlottableTextProps

export type {
    CheckboxItemProps,
    ContentProps,
    GroupProps,
    ItemIndicatorProps,
    ItemProps,
    LabelProps,
    MenuProps,
    OverlayProps,
    PortalProps,
    RadioGroupProps,
    RadioItemProps,
    RootProps,
    SeparatorProps,
    SubContentProps,
    SubProps,
    SubTriggerProps,
    TriggerProps,
}
