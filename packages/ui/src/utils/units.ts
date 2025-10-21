import { PixelRatio } from 'react-native'

import { Config } from '../config'

export const remToPoints = (rem: string): number => {
    const rootFS = Config.get('theme.ROOT_FONT_SIZE')
    return PixelRatio.getFontScale() * rootFS * parseFloat(rem)
}
