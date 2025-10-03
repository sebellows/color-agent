import Constants from 'expo-constants'

import { type AppConfig } from '../app.config.types'

const appConfig = Constants.expoConfig?.extra as AppConfig

export default appConfig
