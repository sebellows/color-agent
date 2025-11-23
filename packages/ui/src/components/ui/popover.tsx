import { Platform } from 'react-native'

import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

import * as PopoverPrimitive from '../primitives/popover'
import { uiStyles } from './styles'
import { TextStyleContext } from './text'
import { WithThemeStyleProps } from './util.types'

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const { animated, card } = uiStyles

const PopoverContent = ({
    ref,
    style,
    align = 'center',
    sideOffset = 4,
    side = 'top',
    portalHost,
    ...props
}: WithThemeStyleProps<
    PopoverPrimitive.ContentProps & {
        side?: 'top' | 'right' | 'bottom' | 'left'
        portalHost?: string
    }
>) => {
    return (
        <PopoverPrimitive.Portal hostName={portalHost}>
            <PopoverPrimitive.Overlay
                style={Platform.OS !== 'web' ? StyleSheet.absoluteFill : undefined}
            >
                <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut}>
                    <TextStyleContext.Provider value={{ color: 'fg' }}>
                        <PopoverPrimitive.Content
                            ref={ref}
                            align={align}
                            sideOffset={sideOffset}
                            style={
                                [
                                    card.main(props),
                                    animated.slideToggle({ open: true, dir: side }),
                                    style,
                                ] as PopoverPrimitive.ContentProps['style']
                            }
                            {...props}
                        />
                    </TextStyleContext.Provider>
                </Animated.View>
            </PopoverPrimitive.Overlay>
        </PopoverPrimitive.Portal>
    )
}
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverContent, PopoverTrigger }
