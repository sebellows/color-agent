import Constants from 'expo-constants'

import { type UiConfig } from './ui.config.types'

if (!Constants.expoConfig)
    Constants.expoConfig = {
        name: 'Color Agent',
        slug: 'color-agent',
    }

if (!Constants.expoConfig?.extra) {
    Constants.expoConfig.extra = {}
}

const UiConfig = Constants.expoConfig?.extra as UiConfig

export default UiConfig
