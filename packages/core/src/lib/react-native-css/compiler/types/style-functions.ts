import { CssColor, Declaration, PropertyId, TokenOrValue } from 'lightningcss'
import { SetRequired } from 'type-fest'

import { STYLE_FUNCTION_SYMBOL, VAR_SYMBOL } from '../../runtime/constants'
import { RenderGuard } from '../../runtime/native/conditions/guards'
import { Getter, VariableContextValue } from '../../runtime/native/reactivity'

/** @deprecated - use `VariableDescriptorRecord` instead */
export type VariableDescriptor = [string, StyleDescriptor]
export type VariableDescriptorRecord = Record<string, StyleDescriptor>
export type VariableRecord = Record<string, LightDarkVariable>
export type LightDarkVariable = [StyleDescriptor] | [StyleDescriptor, StyleDescriptor]

export type InlineVariable = {
    [VAR_SYMBOL]: 'inline'
    [key: string | symbol]: StyleDescriptor | undefined
}

export type PropertyName = PropertyId['property']

export type ResolveValueOptions = {
    castToArray?: boolean
    inheritedVariables?: VariableContextValue
    inlineVariables?: InlineVariable | undefined
    renderGuards?: RenderGuard[]
    variableHistory?: Set<string>
}

export type SimpleResolveValue = (
    styleFn: StyleFunction,
    value: StyleDescriptor,
    castToArray?: boolean,
) => any

export type StyleFunctionResolver<T extends StyleTokenType = StyleTokenType> = (
    resolveValue: SimpleResolveValue,

    /**
     * The token value to either parse, return, or pass to the `resolveValue` function
     */
    value: StyleFunctionDescriptor<T>,

    /**
     * The getter is passed to the callback which was passed to an Observable instance.
     *
     * @example
     * ```ts
     * const obs = observable((read: Getter) => resolve(read, sortedRules))
     * ```
     */
    get: Getter,

    /**
     * Options for dealing with and resolving CSS variables (mostly)
     */
    options: ResolveValueOptions,
) => StyleDescriptor | undefined

/**
 * We use an object to register the style resolver functions so we can
 * refer to them by name/key, rather than directly calling them every time.
 */
export type StyleFunctionsRegistry = Readonly<Record<string, StyleFunctionResolver>>

/**
 * The key a StyleFunctionResolver was registered under, e.g.:
 * `em`, `rem`, `vw`, etc.
 */
export type StyleFunction = keyof StyleFunctionsRegistry

type ColorTokenValue = {
    colorSpace: Extract<CssColor, { alpha?: number }>
    components: [number, number, number]
    alpha?: number
}

type TokenValueMap = {
    color: ColorTokenValue
}

export type TokenDescriptor<$T extends keyof TokenValueMap = keyof TokenValueMap> = {
    $type: $T
    $value: TokenValueMap[$T]
}

type TokenWithValue = SetRequired<TokenOrValue, 'type' | 'value'>

export type StyleTokenType = TokenOrValue['type']

export type GetTokenOrValue<T extends StyleTokenType> = Extract<TokenOrValue, { type: T }>

type NestedTokenType<
    T extends StyleTokenType,
    TToken extends GetTokenOrValue<T> = GetTokenOrValue<T>,
> = TToken extends TokenWithValue ?
    TToken['value'] extends { type: infer NestedType } ?
        NestedType
    :   never
:   never

export type StyleFunctionDescriptor<
    T extends StyleTokenType = StyleTokenType,
    VType extends NestedTokenType<T> = NestedTokenType<T>,
> = {
    type: T

    /** The type of the token value if that value is another token. */
    valueType?: VType

    /** The name of a registered function that will parse a value */
    func: StyleFunction | TokenDescriptor

    /**
     * If `func` refers to a registered function, set the value or function arguments
     * to be applied to that function here.
     */
    value: StyleDescriptor

    // styleProperty?: S

    /** Will the value be computed at runtime? */
    computed?: boolean

    /** Should the value be computed only after styles have been calculated? */
    processLast?: boolean
    // rawValue?: any // could be a CSS Token, a string, or a number... its the original value
    [STYLE_FUNCTION_SYMBOL]: boolean
}

export type DeclarationProperty = Declaration['property']
export type DeclarationToken<P extends DeclarationProperty> = Extract<Declaration, { property: P }>
export type DeclarationValue<
    P extends DeclarationProperty,
    Decl extends Declaration = Extract<Declaration, { property: P }>,
> = Decl['value']

export interface RestyleFunctionContainer<P extends DeclarationProperty> {
    shorthand: boolean
    property: P
    enum?: string[] | { [key: string]: string }
    transform: <V = any>(declaration: DeclarationValue<P>, builder: StyleSheet) => V
}

export type StyleDeclaration = {
    // If descriptor is:
    // - An object composed of keys with primitive values set
    // - A StyleFunctionDescriptor, the value will be computed at runtime,
    // - If a primitive value, its a style that needs to be set
    type: 'static-object' | 'descriptor' | 'value'
    descriptor: Record<string, StyleDescriptor> | StyleFunctionDescriptor | StyleDescriptor
    propertyPath?: string | string[]
    delay?: boolean
}

export type StyleDescriptorRecord = { [key: string]: StyleDescriptor }

export type StyleValue = string | number | boolean | undefined

export type StyleDescriptor =
    | string
    | number
    | boolean
    | undefined
    // | StyleFunction
    | StyleFunctionDescriptor
    | StyleDescriptorRecord
    | StyleDescriptor[]
// | StyleDescriptorToken

export type RNStyleDescriptor<P extends PropertyName> = {
    property: P
    value: StyleDescriptor
    declarations: any
    forceTuple?: boolean
    delayed?: boolean // may already be defined in value if value is a StyleFunctionDescriptor
}

// export type StyleFunction =
//     | [
//           Record<never, never>,
//           string, // string
//       ]
//     | [
//           Record<never, never>,
//           string, // string
//           undefined | StyleDescriptor[], // arguments
//       ]
//     | [
//           Record<never, never>,
//           string, // string
//           undefined | StyleDescriptor[], // arguments
//           1, // Should process after styles have been calculated
//       ]
