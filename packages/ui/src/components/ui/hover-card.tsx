import { Platform, StyleSheet } from 'react-native'

import Animated, { FadeIn } from 'react-native-reanimated'

import * as HoverCardPrimitive from '../primitives/hover-card'
import { ThemeStyleProps, uiStyles } from './styles'
import { TextStyleContext } from './text'

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = ({
    ref,
    style,
    align = 'center',
    sideOffset = 4,
    border,
    boxShadow,
    padding = 'md',
    size = 64,
    zIndex = '50',
    ...props
}: HoverCardPrimitive.ContentProps & ThemeStyleProps) => {
    //   const { open } = HoverCardPrimitive.useRootContext()

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
                                    uiStyles.card({ border, boxShadow, size, zIndex }),
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
