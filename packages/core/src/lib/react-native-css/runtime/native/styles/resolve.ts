import { transformKeys } from '../../../common/properties'
import type {
    InlineVariable,
    PropertyName,
    StyleDescriptor,
    StyleFunction,
    StyleFunctionDescriptor,
} from '../../../compiler'
import { normalizeTokenSelector } from '../../../compiler/selectors'
import type { RenderGuard } from '../conditions/guards'
import { type Getter, type VariableContextValue } from '../reactivity'
import { animation } from './animation'
import { border } from './border'
import { boxShadow } from './box-shadow'
import { calc } from './calc'
import {
    fontScale,
    hairlineWidth,
    pixelRatio,
    pixelSizeForLayoutSize,
    platformColor,
    roundToNearestPixel,
} from './platform-functions'
import { ShortHandSymbol } from './shorthand'
import { textShadow } from './text-shadow'
import { transform } from './transform'
import { em, rem, vh, vw } from './units'
import { varResolver } from './variables'

export type SimpleResolveValue = (value: StyleDescriptor, castToArray?: boolean) => any

export type StyleFunctionResolver = (
    resolveValue: SimpleResolveValue,
    func: StyleFunction,

    /**
     * The getter is passed to the callback which was passed to an Observable instance.
     *
     * @example
     * ```ts
     * const obs = observable((read: Getter) => resolve(read, sortedRules))
     * ```
     */
    get: Getter,
    options: ResolveValueOptions,
) => StyleDescriptor | StyleDescriptor[] | undefined

// | (StyleDescriptor[] & {
//       [ShortHandSymbol]: boolean
//   })

export type StyleTransformFunction<
    P extends PropertyName,
    D extends StyleFunctionDescriptor<P> = StyleFunctionDescriptor<P>,
> = (params: { desc: D; get: Getter; options: ResolveValueOptions }) => TVal | undefined | null

const shorthands: Record<`@${string}`, StyleFunctionResolver> = {
    '@textShadow': textShadow,
    '@transform': transform,
    '@boxShadow': boxShadow,
    '@border': border,
}

const functions: Record<string, StyleFunctionResolver> = {
    calc,
    em,
    vw,
    vh,
    rem,
    platformColor,
    hairlineWidth,
    pixelRatio,
    fontScale,
    pixelSizeForLayoutSize,
    roundToNearestPixel,
    animationName: animation,
    ...shorthands,
}

export type ResolveValueOptions = {
    castToArray?: boolean
    inheritedVariables?: VariableContextValue
    inlineVariables?: InlineVariable | undefined
    renderGuards?: RenderGuard[]
    variableHistory?: Set<string>
}

export function resolveValue(
    value: StyleDescriptor,
    get: Getter,
    options: ResolveValueOptions,
): StyleDescriptor | { [key: string]: StyleDescriptor } {
    const { castToArray } = options

    switch (typeof value) {
        case 'bigint':
        case 'symbol':
        case 'undefined':
        case 'function':
            // These types are not supported
            return undefined
        case 'number':
            return value
        case 'boolean':
            return value
        case 'string':
            // Inline vars() might set a value with a px suffix
            return value.endsWith('px') ? parseInt(value.slice(0, -2), 10) : value
        case 'object': {
            if (!Array.isArray(value)) return value

            if (isDescriptorArray(value)) {
                value = value.map(d => {
                    const value = resolveValue(d, get, options)
                    return value === undefined ? [] : value
                }) as StyleDescriptor[]

                return value
                // return castToArray && !Array.isArray(value) ? [value] : value
            }

            const [_props, name, args] = value

            const simpleResolve: SimpleResolveValue = value => {
                return resolveValue(value, get, options)
            }

            // `@translate`, `@rotate`, `@scale`, etc. => `translate`, `rotate`, `scale`, etc.
            const unprefixedName = normalizeTokenSelector(name, '@')

            if (name === 'var') {
                return varResolver(simpleResolve, value, get, options)
            } else if (name in functions) {
                const fn = functions[name]

                if (typeof fn !== 'function') {
                    throw new Error(`Unknown function: ${name}`)
                }

                value = fn(simpleResolve, value as StyleFunction, get, options)
            } else if (transformKeys.has(name)) {
                // translate, rotate, scale, etc.
                return simpleResolve(args?.[0], castToArray)
            } else if (transformKeys.has(unprefixedName)) {
                // returns `StaticStyleObj`
                return { [unprefixedName]: simpleResolve(args, castToArray)[0] }
            } else {
                let _args = simpleResolve(args, castToArray)

                if (_args === undefined) return undefined

                if (Array.isArray(_args)) {
                    if (_args.length === 1) {
                        _args = _args[0]
                    }

                    let joinedArgs = _args
                        .map((arg: unknown) => (Array.isArray(arg) ? arg.flat().join(' ') : arg))
                        .join(', ')

                    if (name === 'radial-gradient') {
                        // Nativewind / Tailwind CSS hack which can force the 'in oklab' color space
                        joinedArgs = joinedArgs.replace('in oklab, ', '')
                    }

                    value = `${name}(${joinedArgs})`
                } else {
                    value = `${name}(${_args})`
                }
            }

            return castToArray && value && !Array.isArray(value) ? [value] : value
        }
    }
}

function isDescriptorArray(value: StyleDescriptor | StyleDescriptor[]): value is StyleDescriptor[] {
    return Array.isArray(value) && typeof value[0] === 'object' ? Array.isArray(value[0]) : true
}
