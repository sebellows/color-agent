import { IsNever, LiteralUnion } from 'type-fest'

/**
 * Allows creating a union type by combining primitive types and literal types without
 * sacrificing auto-completion in IDEs for the literal type part of the union.
 *
 * Currently, when a union type of a primitive type is combined with literal types,
 * TypeScript loses all information about the combined literals. Thus, when such type
 * is used in an IDE with autocompletion, no suggestions are made for the declared literals.
 *
 * This type is a workaround for [Microsoft/TypeScript#29729](https://github.com/Microsoft/TypeScript/issues/29729).
 * It will be removed as soon as it's not needed anymore.
 *
 * NOTE: Taken from `type-fest`, which doesn't publicly export the utility...
 * out of spite, I bet 😠
 *
 * Use-cases:
 * - Get string keys from a type which may have number keys.
 * - Makes it possible to index using strings retrieved from template types.
 *
 * @example
 * ```
 * const colors = [
 *     'blue',
 *     'red',
 *     'green',
 * ] as const
 *
 * type Color = (typeof colors)[number]
 *
 * const colorSet = new Set<Color>(colors)
 * const hasBlue = colorSet.has('blue')
 * \// 'blue' will be flagged as error in VS Code
 *
 * const colorSet = new Set<LiteralStringUnion<Color>>(colors)
 * const hasBlue = colorSet.has('blue')
 * \// 'blue' will no longer be flagged
 * ```
 */
export type LiteralStringUnion<BaseType> = LiteralUnion<BaseType, string>

/**
 * An if-else-like type that resolves depending on whether the given `boolean` type
 * is `true` or `false`.
 *
 * ! NOTE: Not exported as of type-fest v4.4.1, but is the replacement type for deprecated
 * ! type utilities like `IfEmptyObject`, `IfNever`, `IfAny`, `IfNull`, and `IfUnknown`.
 *
 * Notes:
 * - Returns a union of if branch and else branch if the given type is `boolean` or `any`.
 *   Example: `If<boolean, 'Y', 'N'>` will return `'Y' | 'N'`.
 * - Returns the else branch if the given type is `never`.
 *   Example: `If<never, 'Y', 'N'>` will return `'N'`.
 *
 * @examples
 * ```ts
 * type A = If<true, 'yes', 'no'>
 * ⧸⧸ => 'yes'
 *
 * type B = If<boolean, 'yes', 'no'>
 * ⧸⧸ => 'yes' | 'no'
 *
 * type C = If<IsNever<never>, 'is never', 'not never'>
 * ⧸⧸ => 'is never'
 * ```
 */
export type If<Type extends boolean, IfBranch, ElseBranch> = IsNever<Type> extends true ? ElseBranch
: Type extends true ? IfBranch
: ElseBranch
