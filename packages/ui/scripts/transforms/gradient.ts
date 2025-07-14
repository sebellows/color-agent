import { RESOLVED_EXTENSION, CSS_EXTENSION } from '../constants'
import { isGradientToken, isReference } from '../token.utils'
import { Token, GradientToken, ReferenceValue, Transform } from '../types'

export const cssGradientTransform: Transform<'gradient'> = {
    name: 'gradient',
    type: 'css/gradient',
    transformer: (token: Token) => {
        const cssExtension: {
            value?: string
            resolvedValue?: string
        } = {}

        if (!isGradientToken(token)) {
            return token
        }

        if (isReference(token.$value)) {
            cssExtension.value = token.$value
        } else {
            cssExtension.value = `linear-gradient(90deg, ${token.$value
                .map(gradient =>
                    isReference(gradient) ? gradient : (
                        `${gradient.color} ${calcPosition(gradient.position)}`
                    ),
                )
                .join(', ')})`
        }

        if (token.$extensions && token.$extensions[RESOLVED_EXTENSION]) {
            const resolvedValue = token.$extensions[RESOLVED_EXTENSION] as Exclude<
                GradientToken['$value'],
                ReferenceValue
            >
            cssExtension.resolvedValue = `linear-gradient(90deg, ${resolvedValue
                .map(gradient =>
                    isReference(gradient) ? gradient : (
                        `${gradient.color} ${calcPosition(gradient.position)}`
                    ),
                )
                .join(', ')})`
        }

        if (Object.keys(cssExtension).length > 0) {
            if (!token.$extensions) {
                token.$extensions = {}
            }
            token.$extensions[CSS_EXTENSION] = cssExtension
        }

        return token
    },
}

const calcPosition = (position: number | ReferenceValue): string => {
    if (isReference(position)) {
        return position
    }

    return `${position * 100}%`
}
