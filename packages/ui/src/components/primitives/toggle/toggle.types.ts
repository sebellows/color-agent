import type { SlottablePressableProps } from '../types'

type RootProps = SlottablePressableProps & {
    pressed: boolean
    onPressedChange: (pressed: boolean) => void
    disabled?: boolean
}

export type { RootProps }
