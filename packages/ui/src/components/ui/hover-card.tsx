import { Platform, StyleSheet } from 'react-native'

import Animated, { FadeIn } from 'react-native-reanimated'

import * as HoverCardPrimitive from '../primitives/hover-card'
import { uiStyles } from './styles'
import { TextStyleContext } from './text'
import { WithThemeStyleProps } from './util.types'

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const { animated, card } = uiStyles

const HoverCardContent = ({
    ref,
    style,
    align = 'center',
    sideOffset = 4,
    size = 64,
    zIndex = '50',
    ...props
}: WithThemeStyleProps<HoverCardPrimitive.ContentProps>) => {
    const { open } = HoverCardPrimitive.useRootContext()

    return (
        <HoverCardPrimitive.Portal>
            <HoverCardPrimitive.Overlay
                style={Platform.OS !== 'web' ? StyleSheet.absoluteFill : undefined}
            >
                <Animated.View entering={FadeIn}>
                    <TextStyleContext.Provider value={{ color: 'componentFg' }}>
                        <HoverCardPrimitive.Content
                            ref={ref}
                            align={align}
                            sideOffset={sideOffset}
                            style={
                                [
                                    card.main({ size, zIndex, ...props }),
                                    animated.toggle({ open }),
                                    style,
                                ] as HoverCardPrimitive.ContentProps['style']
                            }
                            {...props}
                        />
                    </TextStyleContext.Provider>
                </Animated.View>
            </HoverCardPrimitive.Overlay>
        </HoverCardPrimitive.Portal>
    )
}
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardContent, HoverCardTrigger }
