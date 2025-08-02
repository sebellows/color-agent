import { Style } from '../types'

export const evaluateStyle = (object: Style) => {
    const newObject: Style = {}

    for (const [key, value] of Object.entries(object)) {
        if (!key.startsWith('--')) {
            if (typeof value === 'string') {
                let newValue = value.replace(/var\(([a-zA-Z-]+)\)/, (_, name) => {
                    return object[name] as string
                })

                newObject[key] = newValue
            } else {
                newObject[key] = value
            }
        }
    }

    return newObject
}
