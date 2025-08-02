import { createContext } from 'react'
import { Appearance, Dimensions, type ColorSchemeName, type LayoutRectangle } from 'react-native'

import { isFunction } from '@coloragent/utils'

import type { LightDarkVariable, StyleDescriptor } from '../../compiler'
import { ROOT_FONT_SIZE, VAR_SYMBOL } from '../constants'

export type Effect = {
    observers: Set<Effect>
    run(): void
}

export type Observable<Value, Arg = Value> = {
    observers: Set<Effect>
    get: (effect?: Effect) => Value
    set: (arg: Arg) => void
    run: () => void
}
type Read<Value, Arg> = (get: Getter, arg?: Arg) => Value
export type Getter = <Value>(observable: Observable<Value, any>) => Value

export const observableBatch: {
    current?: Set<Effect>
} = {}

export function observable<Value, Arg = Value>(
    init: Value | Read<Value, Arg>,
    equality = Object.is,
) {
    let value: Value
    let isStatic = !isFunction(init)
    let didInit: boolean | undefined
    let lastArg: Arg | undefined

    if (typeof init !== 'function') {
        value = init
        didInit = true
    }

    const observers = new Set<Effect>()
    const effect: Effect = {
        observers,
        run: () => {
            if (!isStatic) {
                const nextValue = (init as Read<Value, Arg>)(getter, lastArg)
                if (equality(value, nextValue)) {
                    return
                }
                value = nextValue
            }

            notify()
        },
    }

    const getter: Getter = observable => observable.get(effect)

    function get(effect?: Effect) {
        if (effect) {
            observers.add(effect)
        }
        if (!didInit) {
            value = (init as Read<Value, Arg>)(getter, undefined)
        }

        return value
    }

    function set(arg: Arg) {
        if (isStatic) {
            if (equality(value, arg)) {
                return
            }
            value = arg as unknown as Value
        } else {
            const nextValue = (init as Read<Value, Arg>)(getter, arg)

            didInit = true
            lastArg = arg

            if (equality(value, nextValue)) {
                return
            }
            value = nextValue
        }

        notify()

        return obs
    }

    function notify() {
        Array.from(observers).forEach(observer => {
            if (observableBatch.current) {
                observableBatch.current.add(observer)
            } else {
                observer.run()
            }
        })
    }

    const obs: Observable<Value, Arg> = {
        observers,
        get,
        set,
        run: effect.run,
    }

    return obs
}

export function cleanupEffect(effect: Effect) {
    if (!effect) return
    for (const dep of effect.observers) {
        dep.observers.delete(effect)
    }
    effect.observers.clear()
}

/**********************************************************************
 * Family Helpers
 **********************************************************************/

export function family<Key, Result = Key, Args extends any = void>(
    fn: (key: Key, args: Args) => Result,
) {
    const map = new Map<Key, Result>()
    return Object.assign(
        (key: Key, args: Args) => {
            let value = map.get(key)
            if (!value) {
                value = fn(key, args)
                map.set(key, value)
            }
            return value
        },
        {
            delete(key: Key) {
                return map.delete(key)
            },
            clear() {
                return map.clear()
            },
        },
    )
}

type WeakFamilyFn<Key, Args = undefined, Result = Key> = ((key: Key, args: Args) => Result) & {
    has(key: Key): boolean
}

export function weakFamily<Key extends WeakKey, Result = Key>(
    fn: (key: Key) => Result,
): WeakFamilyFn<Key, void, Result>
export function weakFamily<Key extends WeakKey, Args = undefined, Result = Key>(
    fn: (key: Key, args: Args) => Result,
): WeakFamilyFn<Key, Args, Result>
export function weakFamily<Key extends WeakKey, Args = undefined, Result = Key>(
    fn: (key: Key, args: Args) => Result,
): WeakFamilyFn<Key, Args, Result> {
    const map = new WeakMap<Key, Result>()
    return Object.assign(
        (key: Key, args: Args) => {
            let value = map.get(key)
            if (!value) {
                value = fn(key, args)
                map.set(key, value)
            }
            return value
        },
        {
            has: (key: Key) => map.has(key),
        },
    )
}

/**********************************************************************
 * Variables
 **********************************************************************/

export type VariableContextValue = Record<string, StyleDescriptor> & {
    [VAR_SYMBOL]: true
}
export const VariableContext = createContext<VariableContextValue>({
    [VAR_SYMBOL]: true,
})

const lightDarkFamily = () => {
    return family<string, Observable<StyleDescriptor, LightDarkVariable>>(() => {
        const obs = observable<StyleDescriptor, LightDarkVariable>(
            (read, lightDark = [undefined, undefined]) => {
                const colorSchemeName = read(colorScheme) ?? Appearance.getColorScheme() ?? 'light'

                return colorSchemeName === 'dark' ? lightDark[1] ?? lightDark[0] : lightDark[0]
            },
        )

        return obs
    })
}
export const rootVariables = lightDarkFamily()
export const universalVariables = lightDarkFamily()

/**********************************************************************
 * Units
 **********************************************************************/

export const rem = observable(ROOT_FONT_SIZE)

/**********************************************************************
 * Pseudo Classes
 **********************************************************************/

export const hoverFamily = weakFamily(() => observable(false))
export const activeFamily = weakFamily(() => observable<boolean>(false))
export const focusFamily = weakFamily(() => observable<boolean>(false))

/**********************************************************************
 * Dimensions
 **********************************************************************/

export const dimensions = observable(Dimensions.get('window'))
export const vw = observable<number>((read, value) => value ?? read(dimensions)?.width)
export const vh = observable<number>((read, value) => value ?? read(dimensions)?.height)

/**********************************************************************
 * Color Scheme
 **********************************************************************/

export const colorScheme = observable<ColorSchemeName>(Appearance.getColorScheme())
Appearance.addChangeListener(event => colorScheme.set(event.colorScheme))

/**********************************************************************
 * Containers
 **********************************************************************/

export type ContainerContextValue = Record<string, Effect>
export const ContainerContext = createContext<ContainerContextValue>({})

export const containerLayoutFamily = weakFamily(() => {
    return observable<LayoutRectangle>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    })
})

export const containerWidthFamily = weakFamily(key => {
    return observable(read => {
        return read(containerLayoutFamily(key))?.width || 0
    })
})

export const containerHeightFamily = weakFamily(key => {
    return observable(read => {
        return read(containerLayoutFamily(key))?.width || 0
    })
})
