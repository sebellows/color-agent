import { useContext, useState } from 'react'
import { Appearance } from 'react-native'

import type { InlineVariable, StyleDescriptor } from '../../compiler'
import { VAR_SYMBOL } from '../constants'
import type { ColorScheme, Props, StyledConfiguration, StyledOptions } from '../runtime.types'
import type { ReactComponent } from '../utils'
import { mappingToConfig, useNativeCss } from './react/use-native-css'
import { usePassthrough } from './react/use-passthrough'
import {
    colorScheme as colorSchemeObs,
    VariableContext,
    type Effect,
    type Getter,
} from './reactivity'
import { resolveValue } from './styles/resolve'

export { StyleCollection } from './injection'

/**
 * Generates a new Higher-Order component the wraps the base component and applies the styles.
 * This is added to the `interopComponents` map so that it can be used in the `wrapJSX` function
 * @param baseComponent
 * @param mapping
 */
export const styled = <const C extends ReactComponent<any>, const M extends StyledConfiguration<C>>(
    baseComponent: C,
    mapping: M,
    options?: StyledOptions,
) => {
    let component: any
    // const type = getComponentType(baseComponent);

    const configs = mappingToConfig(mapping)

    if (options?.passThrough) {
        component = (props: Record<string, any>) => {
            return usePassthrough(baseComponent, props, configs)
        }
    } else {
        component = (props: Record<string, any>) => {
            return useNativeCss(baseComponent, props, configs)
        }
    }

    const name = baseComponent.displayName ?? baseComponent.name ?? 'unknown'
    component.displayName = `CssInterop.${name}`
    return component
}

export const colorScheme: ColorScheme = {
    get() {
        return colorSchemeObs.get() ?? Appearance.getColorScheme() ?? 'light'
    },
    set(value) {
        return colorSchemeObs.set(value)
    },
}

export const useUnstableNativeVariable = useNativeVariable

export const useCssElement = <
    const C extends ReactComponent<any>,
    const M extends StyledConfiguration<C>,
>(
    component: C,
    incomingProps: Props,
    mapping: M,
) => {
    const [config] = useState(() => mappingToConfig(mapping))
    return useNativeCss(component, incomingProps, config)
}

export function useNativeVariable(name: string) {
    if (name.startsWith('--')) {
        name = name.slice(2)
    }

    const inheritedVariables = useContext(VariableContext)
    const [effect, setState] = useState(() => {
        const effect: Effect = {
            observers: new Set(),
            run: () => setState(state => ({ ...state })),
        }

        const get: Getter = observable => observable.get(effect)

        return { ...effect, get }
    })

    return resolveValue({ type: 'var', value: 'name' }, effect.get, { inheritedVariables })
}

export function vars(variables: Record<string, StyleDescriptor>) {
    ;(variables as InlineVariable)[VAR_SYMBOL] = 'inline'
    return variables
}
