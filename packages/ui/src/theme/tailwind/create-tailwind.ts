import { evaluateStyle } from './lib/evaluate-style'
import { fontVariant } from './lib/font-variant'
import { letterSpacing } from './lib/letter-spacing'
import { Utilities, Style, AppContext } from './types'

export const create = (utilities: Utilities, context: AppContext) => {
    // Pass a list of class names separated by a space, for example:
    // "bg-green-100 text-green-800 font-semibold")
    // and receive a styles object for use in React Native views
    const tailwind = (classNames: string) => {
        const style: Style = {}

        if (!classNames) {
            return style
        }

        // Font variant utilities need a special treatment, because there can be
        // many font variant classes and they need to be transformed to an array
        fontVariant(style, classNames)

        // Letter spacing also needs a special treatment, because its value is set
        // in em unit, that's why it requires a font size to be set too, so that
        // we can calculate a px value
        letterSpacing(utilities, style, classNames)

        const separateClassNames = classNames.replace(/\s+/g, ' ').trim().split(' ')

        for (const className of separateClassNames) {
            // Skip font variant and letter spacing utiltiies, because they're
            // handled by `addFontVariant` and `addLetterSpacing` functions
            if (className.endsWith('-nums') || className.startsWith('tracking-')) {
                continue
            }

            const utility = utilities[className]

            if (!utility) {
                console.warn(`Unsupported Tailwind class: "${className}"`)
                continue
            }

            Object.assign(style, utility.style)
        }

        return evaluateStyle(style)
    }

    return tailwind
}
