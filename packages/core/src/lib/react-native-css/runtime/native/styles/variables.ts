import type { ResolveValueOptions, SimpleResolveValue, StyleFunction } from '../../../compiler'
import { VAR_SYMBOL } from '../../constants'
import { rootVariables, universalVariables, type Getter } from '../reactivity'

// import type { ResolveValueOptions, SimpleResolveValue } from './resolve'

export function varResolver(
    resolve: SimpleResolveValue,
    fn: StyleFunction,
    get: Getter,
    options: ResolveValueOptions,
) {
    const {
        renderGuards = [],
        inheritedVariables: variables = { [VAR_SYMBOL]: true },
        inlineVariables,
        variableHistory = new Set(),
    } = options

    const args = fn[2]

    if (!args) return

    const [nameDescriptor, fallback] = args

    const name = resolve(nameDescriptor)

    // If this recurses back to the same variable, we need to stop
    if (variableHistory.has(name)) {
        return
    }

    if (name in variables) {
        renderGuards.push({ type: 'var', name, value: variables[name] })
        return variables[name]
    }

    variableHistory.add(name)

    let value: any = undefined

    // let value = resolve(inlineVariables?.[name])
    if (value !== undefined) {
        options.inlineVariables ??= { [VAR_SYMBOL]: 'inline' }
        options.inlineVariables[name] = value

        return value
    }

    value = resolve(variables[name])
    if (value !== undefined) {
        renderGuards.push({ type: 'var', name, value: variables[name] })
        options.inlineVariables ??= { [VAR_SYMBOL]: 'inline' }
        options.inlineVariables[name] = value

        return value
    }

    value = resolve(get(universalVariables(name))) ?? resolve(get(rootVariables(name)))
    if (value !== undefined) {
        options.inlineVariables ??= { [VAR_SYMBOL]: 'inline' }
        options.inlineVariables[name] = value
        return value
    }

    return resolve(fallback)
}
