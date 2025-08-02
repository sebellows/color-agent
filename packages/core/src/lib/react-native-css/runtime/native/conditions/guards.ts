import type { ComponentState } from '../react/use-native-css'
import type { ContainerContextValue, Effect, VariableContextValue } from '../reactivity'

export type RenderGuard =
    | ['attr', string, any]
    | ['dataSet', string, any]
    | ['vars', string, any]
    | ['containers', string, Effect]

export function testGuards(
    state: ComponentState,
    currentProps: any,
    inheritedVariables: VariableContextValue,
    inheritedContainers: ContainerContextValue,
) {
    return state.guards?.some(guard => {
        let result = false

        switch (guard[0]) {
            case 'attr':
                // Attribute
                result = currentProps?.[guard[1]] !== guard[2]
                break
            case 'dataSet':
                // DataSet
                result = currentProps?.dataSet?.[guard[1]] !== guard[2]
                break
            case 'vars':
                // Variables
                result = inheritedVariables[guard[1]] !== guard[2]
                break
            case 'containers':
                // Containers
                result = inheritedContainers[guard[1]] !== guard[2]
                break
        }

        if (result) {
            console.log(`[guards.ts]: Guard ${guard[0]}:${guard[1]} failed`)
        }

        return result
    })
}
