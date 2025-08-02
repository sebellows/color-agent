import { createElement, type ComponentType } from 'react'

import { isString } from '@coloragent/utils'

import { INLINE_RULE_SYMBOL } from '../../constants'
import { Props } from '../../runtime.types'
import type { Config } from './use-native-css'

const cache = new Map<string, Record<string, any>>()

export function usePassthrough<T extends ComponentType<any>, P extends Props>(
    type: T,
    { ...props }: P,
    configs: Config[],
) {
    for (const config of configs) {
        let { source, target } = config
        let strTarget = isString(target) ? target : ''

        const classNames = props[source]

        let styles = cache.get(source)
        if (styles === undefined) {
            styles = { [INLINE_RULE_SYMBOL]: classNames }
        }

        delete props[source]

        if (classNames === undefined || target === false) {
            continue
        }

        let targetProps = props

        if (Array.isArray(target) && target.length > 0) {
            for (let i = 0; i < target.length - 1; i++) {
                const prop = target[i]
                let value = props[prop] ?? ({} as P[typeof prop])
                if (props[prop] === undefined) {
                    Object.assign(props, { [prop]: value })
                }
                targetProps = value
            }
            strTarget = target[target.length - 1]!
        }

        if (Array.isArray(targetProps[strTarget])) {
            Object.assign(targetProps, { [strTarget]: [...targetProps[strTarget], styles] })
        } else if (targetProps[strTarget]) {
            Object.assign(targetProps, { [strTarget]: [targetProps[strTarget], styles] })
        } else {
            Object.assign(targetProps, { [strTarget]: styles })
        }
    }

    return createElement(type, props)
}
