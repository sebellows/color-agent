import { useFonts } from 'expo-font'

import NotoSansBold from '../assets.native/fonts/Noto_Sans/NotoSans-Bold.ttf'
import NotoSansMedium from '../assets.native/fonts/Noto_Sans/NotoSans-Medium.ttf'
import NotoSansRegular from '../assets.native/fonts/Noto_Sans/NotoSans-Regular.ttf'
import NotoSansSemiBold from '../assets.native/fonts/Noto_Sans/NotoSans-SemiBold.ttf'
import SpaceGroteskBold from '../assets.native/fonts/Space_Grotesk/SpaceGrotesk-Bold.ttf'
import SpaceGroteskMedium from '../assets.native/fonts/Space_Grotesk/SpaceGrotesk-Medium.ttf'
import SpaceGroteskRegular from '../assets.native/fonts/Space_Grotesk/SpaceGrotesk-Regular.ttf'
import SpaceGroteskSemiBold from '../assets.native/fonts/Space_Grotesk/SpaceGrotesk-SemiBold.ttf'
import SpaceMonoBold from '../assets.native/fonts/Space_Mono/SpaceMono-Bold.ttf'
import SpaceMonoRegular from '../assets.native/fonts/Space_Mono/SpaceMono-Regular.ttf'

export const useAppFonts = () => {
    const [fontsLoaded, error] = useFonts({
        'SpaceMono-Regular': SpaceMonoRegular,
        'SpaceMono-Bold': SpaceMonoBold,
        'NotoSans-Regular': NotoSansRegular,
        'NotoSans-Medium': NotoSansMedium,
        'NotoSans-SemiBold': NotoSansSemiBold,
        'NotoSans-Bold': NotoSansBold,
        'SpaceGrotesk-Regular': SpaceGroteskRegular,
        'SpaceGrotesk-Medium': SpaceGroteskMedium,
        'SpaceGrotesk-SemiBold': SpaceGroteskSemiBold,
        'SpaceGrotesk-Bold': SpaceGroteskBold,
    })

    if (error) {
        console.error('Error loading fonts', error)
    }

    return fontsLoaded
}
