import { useFonts } from 'expo-font'

import NotoSansBold from '@ui/assets.native/fonts/Noto_Sans/NotoSans-Bold.ttf'
import NotoSansMedium from '@ui/assets.native/fonts/Noto_Sans/NotoSans-Medium.ttf'
import NotoSansRegular from '@ui/assets.native/fonts/Noto_Sans/NotoSans-Regular.ttf'
import NotoSansSemiBold from '@ui/assets.native/fonts/Noto_Sans/NotoSans-SemiBold.ttf'
import SpaceGroteskBold from '@ui/assets.native/fonts/Space_Grotesk/SpaceGrotesk-Bold.ttf'
import SpaceGroteskMedium from '@ui/assets.native/fonts/Space_Grotesk/SpaceGrotesk-Medium.ttf'
import SpaceGroteskRegular from '@ui/assets.native/fonts/Space_Grotesk/SpaceGrotesk-Regular.ttf'
import SpaceGroteskSemiBold from '@ui/assets.native/fonts/Space_Grotesk/SpaceGrotesk-SemiBold.ttf'
import SpaceMonoBold from '@ui/assets.native/fonts/Space_Mono/SpaceMono-Bold.ttf'
import SpaceMonoRegular from '@ui/assets.native/fonts/Space_Mono/SpaceMono-Regular.ttf'

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
