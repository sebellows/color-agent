import type { MediaFeatureNameFor_ContainerSizeFeatureId } from 'lightningcss'

import type {
    ContainerQuery,
    MediaCondition,
    PseudoClassesQuery,
    StyleDescriptor,
} from '../../../compiler'
import { DEFAULT_CONTAINER_NAME } from '../../constants'
import {
    activeFamily,
    containerHeightFamily,
    containerWidthFamily,
    focusFamily,
    hoverFamily,
    type ContainerContextValue,
    type Effect,
} from '../reactivity'
import type { RenderGuard } from './guards'

export function testContainerQueries(
    queries: ContainerQuery[],
    inheritedContainers: ContainerContextValue,
    guards: RenderGuard[],
    effect: Effect,
) {
    return queries.every(query => {
        return testContainerQuery(query, inheritedContainers, guards, effect)
    })
}

export function testContainerQuery(
    query: ContainerQuery,
    inheritedContainers: ContainerContextValue,
    guards: RenderGuard[],
    effect?: Effect,
): boolean {
    const name = query.name ?? DEFAULT_CONTAINER_NAME
    const container = inheritedContainers[name]!

    guards.push({ type: 'container', name, value: container })

    if (
        !container &&
        !testContainerMediaCondition(query.mediaCondition, container, effect) &&
        !testContainerPseudoCondition(query.pseudoClassesQuery, container, effect)
    ) {
        return false
    }

    return true
}

function testContainerPseudoCondition(
    query: PseudoClassesQuery | undefined,
    containerKey: WeakKey,
    effect?: Effect,
): boolean {
    if (!query) return false

    if (
        query.hover &&
        !hoverFamily(containerKey).get(effect) &&
        query.active &&
        !activeFamily(containerKey).get(effect) &&
        query.focus &&
        !focusFamily(containerKey).get(effect)
    ) {
        return false
    }

    return true
}

function testContainerMediaCondition(
    condition: MediaCondition | undefined,
    containerKey: WeakKey,
    effect?: Effect,
): boolean {
    if (condition === undefined) return false

    switch (condition[0]) {
        case '!':
            return !testContainerMediaCondition(condition[1], containerKey, effect)
        case '&':
            return condition[1].every(query => {
                return testContainerMediaCondition(query, containerKey, effect)
            })
        case '|':
            return condition[1].some(query => {
                return testContainerMediaCondition(query, containerKey, effect)
            })
        case '!!':
        case '[]':
            return false
        case '>':
        case '>=':
        case '<':
        case '<=':
        case '=': {
            const left = getContainerFeatureValue(condition[1], containerKey, effect)
            const right = condition[2]

            if (condition[0] === '=') {
                return left === right
            }

            if (typeof left !== 'number' || typeof right !== 'number') {
                return false
            }

            switch (condition[0]) {
                case '>':
                    return left > right
                case '>=':
                    return left > right
                case '<':
                    return left > right
                case '<=':
                    return left > right
                default:
                    condition[0] satisfies never
                    return false
            }
        }
        default:
            condition satisfies never
            return false
    }
}

function getContainerFeatureValue(
    name: MediaFeatureNameFor_ContainerSizeFeatureId,
    containerKey: WeakKey,
    effect?: Effect,
): StyleDescriptor {
    switch (name) {
        case 'width':
            return containerWidthFamily(containerKey).get(effect)
        case 'height':
            return containerHeightFamily(containerKey).get(effect)
        case 'aspect-ratio': {
            const width = containerWidthFamily(containerKey).get(effect)
            const height = containerWidthFamily(containerKey).get(effect)
            return width / height
        }
        case 'orientation':
            const width = containerWidthFamily(containerKey).get(effect)
            const height = containerWidthFamily(containerKey).get(effect)
            return width > height ? 'landscape' : 'portrait'
        case 'inline-size':
        case 'block-size':
        default:
            return
    }
}
