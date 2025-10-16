import { ComponentType, ComponentTypeName } from '@ui/types/component.types'

export type SlotProps<T extends ComponentTypeName> = React.ComponentPropsWithoutRef<
    ComponentType<T>
> & {
    asChild?: boolean
    ref?: React.Ref<ComponentType<T>>
}

export type ImageSlotProps = SlotProps<'Image'>
export type ViewSlotProps = SlotProps<'View'>
export type PressableSlotProps = SlotProps<'Pressable'> & {
    /** Platform: WEB ONLY */
    onKeyDown?: (ev: React.KeyboardEvent) => void
    /** * Platform: WEB ONLY */
    onKeyUp?: (ev: React.KeyboardEvent) => void
}
export type TextSlotProps = SlotProps<'Text'>
