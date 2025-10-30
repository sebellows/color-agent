import { SlottablePressableProps, SlottableViewProps } from '../types'

type RootProps = SlottablePressableProps & {
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    disabled?: boolean
    /**
     * Platform: WEB ONLY
     */
    onKeyDown?: (event: React.KeyboardEvent) => void
}

type ThumbProps = SlottableViewProps

export type { RootProps, ThumbProps }
