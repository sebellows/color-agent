import { View } from 'react-native'

import { Slot } from '../slot'
import type { RootProps } from './separator.types'

const Root = ({ ref, asChild, decorative, orientation = 'horizontal', ...props }: RootProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <Component
            role={decorative ? 'presentation' : 'separator'}
            aria-orientation={orientation}
            ref={ref}
            {...props}
        />
    )
}

Root.displayName = 'SeparatorRoot'

export { Root }
