import { isPlainObject, isString } from '@coloragent/utils'
import type {
    DeclarationBlock,
    ParsedComponent,
    Rule,
    Token,
    TokenOrValue,
    UnknownAtRule,
} from 'lightningcss'

import { isBooleanish } from '../../../utils'
import { toRNProperty } from './selectors'
import { splitByDelimiter } from './split-by-delimiter'
import type { StyleSheetBuilder } from './stylesheet'
import type { StyleRuleMapping } from './types'

type UnknownAtRuleValue = Omit<UnknownAtRule, 'prelude' | 'block'> & {
    prelude: Extract<TokenOrValue, { type: 'token' }>[]
    block: Extract<TokenOrValue, { type: 'token' }>[] | null
}

export interface PropAtRule {
    type: 'unknown'
    value: UnknownAtRuleValue
    // value: {
    //   name: "prop";
    //   prelude: Extract<TokenOrValue, { type: "token" }>[];
    //   block: Extract<TokenOrValue, { type: "token" }>[] | null;
    // };
}

/***********************************************
 * @react-native                               *
 ***********************************************/

export interface ReactNativeAtRule {
    type: 'custom'
    value: {
        name: 'react-native'
        prelude: null | Extract<ParsedComponent, { type: 'repeated' }>
        body: {
            type: 'declaration-list'
            value: Pick<DeclarationBlock, 'declarations'>
        }
    }
}

export function maybeMutateReactNativeOptions(
    rule: Rule | ReactNativeAtRule,
    builder: StyleSheetBuilder,
) {
    if (rule.type !== 'custom' || rule.value?.name !== 'react-native') {
        return
    }

    const { declarations } = rule.value.body.value
    if (!declarations) return

    for (const declaration of declarations) {
        if (declaration.property !== 'custom') continue

        switch (declaration.value.name) {
            case 'preserve-variables': {
                declaration.value.value.forEach(token => {
                    if (token.type !== 'dashed-ident' || !isBooleanish(token.value)) {
                        return
                    }

                    builder.setOption('preserveVariables', token.value === 'true')
                })
                break
            }
            default:
                break
        }
    }
}

/***********************************************
 * @prop                                       *
 ***********************************************/

function isPropAtRule(rule: Rule | PropAtRule): rule is PropAtRule {
    return rule.type === 'unknown' && rule.value.name === 'prop'
}

function isToken(token: unknown): token is Token {
    return isPlainObject(token) && 'type' in token && token.type === 'token'
}

function isNotOfTokenType(type: Token['type']) {
    return (token: TokenOrValue) => isToken(token.value) && token.value.type !== type
}

function isOfTokenType(type: Token['type']) {
    return (token: TokenOrValue) => isToken(token.value) && token.value.type === type
}

export function parsePropAtRule(rules?: (Rule | PropAtRule)[]) {
    const mapping: StyleRuleMapping = {}

    if (!rules) return mapping

    for (const rule of rules) {
        if (!isPropAtRule(rule)) continue

        if (rule.value.prelude.length > 0) {
            const prelude = rule.value.prelude.filter(isNotOfTokenType('white-space'))

            propAtRuleBlock(prelude, mapping)
        } else if (rule.value.block) {
            // Remove all whitespace tokens
            const blocks = rule.value.block.filter(isNotOfTokenType('white-space'))

            // Separate each rule, delimited by a semicolon
            const blockRules = splitByDelimiter(blocks, isOfTokenType('semicolon'))

            for (const block of blockRules) {
                propAtRuleBlock(block, mapping)
            }
        }
    }

    return mapping
}

function propAtRuleBlock(
    token: Extract<TokenOrValue, { type: 'token' }>[],
    mapping: StyleRuleMapping = {},
): StyleRuleMapping {
    const [from, to] = splitByDelimiter(token, item => {
        return item.value.type === 'colon'
    })

    if (!from || from.length !== 1 || !to) {
        return mapping
    }

    const fromToken = from[0]
    if (!fromToken || fromToken.value.type !== 'ident') {
        return mapping
    }

    mapping[toRNProperty(fromToken.value.value)] = to.flatMap((item, index) => {
        switch (item.value.type) {
            case 'delim':
                return index === 0 && item.value.value === '^' ? ['^'] : []
            case 'ident':
                return [toRNProperty(item.value.value)]
            default:
                return []
        }
    })

    return mapping
}
