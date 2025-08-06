import { StyleDescriptor } from '../../../compiler'
import type { ComponentState } from '../react/use-native-css'
import type { ContainerContextValue, Effect, VariableContextValue } from '../reactivity'

export type RenderGuard =
    | { type: 'attr'; name: string; value: string }
    | { type: 'dataSet'; name: string; value: string }
    | { type: 'var'; name: string; value: StyleDescriptor }
    | { type: 'container'; name: string; value: Effect }
// | ['attr', string, any]
// | ['dataSet', string, any]
// | ['vars', string, any]
// | ['containers', string, Effect]

export function testGuards(
    state: ComponentState,
    currentProps: any,
    inheritedVariables: VariableContextValue,
    inheritedContainers: ContainerContextValue,
) {
    return state.guards?.some(guard => {
        let result = false

        switch (guard.type) {
            case 'attr':
                // Attribute
                result = currentProps?.[guard.name] !== guard.value
                break
            case 'dataSet':
                // DataSet
                result = currentProps?.dataSet?.[guard.name] !== guard.value
                break
            case 'var':
                // Variables
                result = inheritedVariables[guard.name] !== guard.value
                break
            case 'container':
                // Containers
                result = inheritedContainers[guard.name] !== guard.value
                break
        }

        if (result) {
            console.log(`[guards.ts]: Guard ${guard.name}:${guard.value} failed`)
        }

        return result
    })
}
