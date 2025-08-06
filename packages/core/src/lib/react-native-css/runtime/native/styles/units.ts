import type { StyleFunctionResolver } from '@core/react-native-css/compiler'
import { RN_CSS_EM_PREFIX } from '@core/react-native-css/runtime/constants'
import { round } from '@core/utils'

import { rem as rem$, vh as vh$, vw as vw$ } from '../reactivity'

export const em: StyleFunctionResolver = (resolve, descriptor) => {
    const { value } = descriptor

    if (!value) return

    const emValue = resolve('var', [RN_CSS_EM_PREFIX])
    return round(Number(value) * emValue)
}

export const vw: StyleFunctionResolver = (_, descriptor, get) => {
    const { value } = descriptor

    if (typeof value !== 'number') return

    return round(get(vw$) * (value / 100))
}

export const vh: StyleFunctionResolver = (_, descriptor, get) => {
    const { value } = descriptor

    if (typeof value !== 'number') return

    return round((value / 100) * get(vh$))
}

export const rem: StyleFunctionResolver = (_, descriptor, get) => {
    const { value } = descriptor

    if (typeof value !== 'number') return

    return round(value * get(rem$))
}
