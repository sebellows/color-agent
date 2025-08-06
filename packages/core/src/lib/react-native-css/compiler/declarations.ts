import { getEntries, isPlainObject, kebabCase } from '@coloragent/utils'
import Color from 'colorjs.io'
import type {
    Angle,
    BorderBlockColor,
    BorderSideWidth,
    BorderStyle,
    ColorOrAuto,
    Animation as CssAnimation,
    CssColor,
    Declaration,
    DimensionPercentageFor_LengthValue,
    EnvironmentVariable,
    FontSize,
    FontStyle,
    FontVariantCaps,
    FontWeight,
    Gradient,
    GradientItemFor_DimensionPercentageFor_LengthValue,
    Length,
    LengthPercentageOrAuto,
    LengthValue,
    LineDirection,
    LineHeight,
    LineStyle,
    MaxSize,
    NumberOrPercentage,
    PropertyId,
    Scale,
    Size,
    Size2DFor_DimensionPercentageFor_LengthValue,
    Time,
    Token,
    TokenOrValue,
    Translate,
    UnresolvedColor,
} from 'lightningcss'
import { ValueOf } from 'type-fest'

import { RNStyleProperty } from '../../restyle/restyle.types'
import { RN_CSS_EM_PREFIX } from '../runtime/constants'
import { isStyleDescriptorArray, toStyleFunctionDescriptor } from '../runtime/utils'
import { parseEasingFunction, parseIterationCount } from './keyframes'
import { toRNProperty } from './selectors'
import type { StyleSheetBuilder } from './stylesheet'
import type { StyleDescriptor, StyleFunction } from './types'

const CommaSeparator = Symbol('CommaSeparator')

type Property = Declaration['property']
type DeclarationToken<P extends Property> = Extract<Declaration, { property: P }>
export type DeclarationValue<
    P extends Property,
    Decl extends Declaration = Extract<Declaration, { property: P }>,
> = Decl['value']

export type Margin = DeclarationValue<'inset'>
type Parser<T extends Declaration['property']> = (
    declaration: Extract<Declaration, { property: T }>,
    builder: StyleSheetBuilder,
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
) => StyleDescriptor | void

const propertyRename: Record<string, string> = {
    'background-image': 'experimental_backgroundImage',
}

const needsRuntimeParsing = new Set([
    'animation',
    'text-shadow',
    'transform',
    'box-shadow',
    'border',
])

const parsers: {
    [K in Declaration['property']]?: Parser<K>
} = {
    'align-content': parseAlignContent,
    'align-items': parseAlignItems,
    'align-self': parseAlignSelf,
    animation: addAnimationValue,
    'animation-delay': addAnimationValue,
    'animation-direction': addAnimationValue,
    'animation-duration': addAnimationValue,
    'animation-fill-mode': addAnimationValue,
    'animation-iteration-count': addAnimationValue,
    'animation-name': addAnimationValue,
    'animation-play-state': addAnimationValue,
    'animation-timing-function': addAnimationValue,
    'aspect-ratio': parseAspectRatio,
    'background-color': parseColorDeclaration,
    'background-image': parseBackgroundImage,
    'block-size': parseSizeDeclaration,
    border: parseBorder,
    'border-block': parseBorderBlock,
    'border-block-color': parseBorderBlockColor,
    'border-block-end': parseBorderBlockEnd,
    'border-block-end-color': parseColorDeclaration,
    'border-block-end-width': parseBorderSideWidthDeclaration,
    'border-block-start': parseBorderBlockStart,
    'border-block-start-color': parseColorDeclaration,
    'border-block-start-width': parseBorderSideWidthDeclaration,
    'border-block-width': parseBorderBlockWidth,
    'border-bottom': parseBorderSide,
    'border-bottom-color': parseColorDeclaration,
    'border-bottom-left-radius': parseSize2DDimensionPercentageDeclaration,
    'border-bottom-right-radius': parseSize2DDimensionPercentageDeclaration,
    'border-bottom-width': parseBorderSideWidthDeclaration,
    'border-color': parseBorderColor,
    'border-end-end-radius': parseSize2DDimensionPercentageDeclaration,
    'border-end-start-radius': parseSize2DDimensionPercentageDeclaration,
    'border-inline': parseBorderInline,
    'border-inline-color': parseBorderBlockColor,
    'border-inline-end': parseBorderInlineEnd,
    'border-inline-end-color': parseColorDeclaration,
    'border-inline-end-width': parseBorderSideWidthDeclaration,
    'border-inline-start': parseBorderInlineStart,
    'border-inline-start-color': parseColorDeclaration,
    'border-inline-start-width': parseBorderSideWidthDeclaration,
    'border-inline-width': parseBorderBlockWidth,
    'border-left': parseBorderSide,
    'border-left-color': parseColorDeclaration,
    'border-left-width': parseBorderSideWidthDeclaration,
    'border-radius': parseBorderRadius,
    'border-right': parseBorderSide,
    'border-right-color': parseColorDeclaration,
    'border-right-width': parseBorderSideWidthDeclaration,
    'border-start-end-radius': parseSize2DDimensionPercentageDeclaration,
    'border-start-start-radius': parseSize2DDimensionPercentageDeclaration,
    'border-style': parseBorderStyleDeclaration,
    'border-top': parseBorderSide,
    'border-top-color': parseColorDeclaration,
    'border-top-left-radius': parseSize2DDimensionPercentageDeclaration,
    'border-top-right-radius': parseSize2DDimensionPercentageDeclaration,
    'border-top-width': parseBorderSideWidthDeclaration,
    'border-width': parseBorderWidth,
    bottom: parseSizeDeclaration,
    'box-shadow': parseBoxShadow,
    'caret-color': parseColorOrAuto,
    color: parseColorDeclaration,
    'column-gap': parseGap,
    container: parseContainer,
    'container-name': parseContainerName,
    'container-type': parseContainerType,
    display: parseDisplay,
    fill: parseSVGPaint,
    flex: parseFlex,
    'flex-basis': parseLengthPercentageOrAutoDeclaration,
    'flex-direction': ({ value }) => value,
    'flex-flow': parseFlexFlow,
    'flex-grow': ({ value }) => value,
    'flex-shrink': ({ value }) => value,
    'flex-wrap': ({ value }) => value,
    font: parseFont,
    'font-family': parseFontFamily,
    'font-size': parseFontSizeDeclaration,
    'font-style': parseFontStyleDeclaration,
    'font-variant-caps': parseFontVariantCapsDeclaration,
    'font-weight': parseFontWeightDeclaration,
    gap: parseGap,
    height: parseSizeDeclaration,
    'inline-size': parseSizeDeclaration,
    inset: parseInset,
    'inset-block': parseInsetBlock,
    'inset-block-end': parseLengthPercentageOrAutoDeclaration,
    'inset-block-start': parseLengthPercentageOrAutoDeclaration,
    'inset-inline': parseInsetInline,
    'inset-inline-end': parseLengthPercentageOrAutoDeclaration,
    'inset-inline-start': parseLengthPercentageOrAutoDeclaration,
    'justify-content': parseJustifyContent,
    left: parseSizeDeclaration,
    'letter-spacing': parseLetterSpacing,
    'line-height': parseLineHeightDeclaration,
    margin: parseMargin,
    'margin-block': parseMarginBlock,
    'margin-block-end': parseLengthPercentageOrAutoDeclaration,
    'margin-block-start': parseLengthPercentageOrAutoDeclaration,
    'margin-bottom': parseSizeDeclaration,
    'margin-inline': parseMarginInline,
    'margin-inline-end': parseLengthPercentageOrAutoDeclaration,
    'margin-inline-start': parseLengthPercentageOrAutoDeclaration,
    'margin-left': parseSizeDeclaration,
    'margin-right': parseSizeDeclaration,
    'margin-top': parseSizeDeclaration,
    'max-block-size': parseSizeDeclaration,
    'max-height': parseSizeDeclaration,
    'max-inline-size': parseSizeDeclaration,
    'max-width': parseSizeDeclaration,
    'min-block-size': parseSizeDeclaration,
    'min-height': parseSizeDeclaration,
    'min-inline-size': parseSizeDeclaration,
    'min-width': parseSizeDeclaration,
    opacity: ({ value }) => value,
    overflow: parseOverflow,
    padding: parsePadding,
    'padding-block': parsePaddingBlock,
    'padding-block-end': parseLengthPercentageOrAutoDeclaration,
    'padding-block-start': parseLengthPercentageOrAutoDeclaration,
    'padding-bottom': parseSizeDeclaration,
    'padding-inline': parsePaddingInline,
    'padding-inline-end': parseLengthPercentageOrAutoDeclaration,
    'padding-inline-start': parseLengthPercentageOrAutoDeclaration,
    'padding-left': parseSizeDeclaration,
    'padding-right': parseSizeDeclaration,
    'padding-top': parseSizeDeclaration,
    position: parsePosition,
    right: parseSizeDeclaration,
    rotate: parseRotate,
    'row-gap': parseGap,
    scale: parseScale,
    stroke: parseSVGPaint,
    'stroke-width': parseLengthDeclaration,
    'text-align': parseTextAlign,
    'text-decoration': parseTextDecoration,
    'text-decoration-color': parseColorDeclaration,
    'text-decoration-line': parseTextDecorationLineDeclaration,
    'text-decoration-style': parseTextDecorationStyle,
    'text-shadow': parseTextShadow,
    'text-transform': ({ value }) => value.case,
    top: parseSizeDeclaration,
    transform: parseTransform,
    transition: addTransitionValue,
    'transition-delay': addTransitionValue,
    'transition-duration': addTransitionValue,
    'transition-property': addTransitionValue,
    'transition-timing-function': addTransitionValue,
    translate: parseTranslate,
    'user-select': parseUserSelect,
    'vertical-align': parseVerticalAlign,
    width: parseSizeDeclaration,
    'z-index': parseZIndex,
}

// This is missing LightningCSS types
;(parsers as Record<string, Parser<Declaration['property']>>)['pointer-events'] =
    parsePointerEvents as Parser<Declaration['property']>

const validCssStyleProperties = new Set(Object.keys(parsers))

export function parseDeclaration(declaration: Declaration, builder: StyleSheetBuilder) {
    if ('vendorPrefix' in declaration && declaration.vendorPrefix.length) {
        return
    }

    if (
        isPlainObject(declaration.value) &&
        'vendorPrefix' in declaration.value &&
        Array.isArray(declaration.value.vendorPrefix) &&
        declaration.value.vendorPrefix.length
    ) {
        return
    }

    if (declaration.property === 'unparsed') {
        parseDeclarationUnparsed(declaration, builder)
        return
    } else if (declaration.property === 'custom') {
        parseDeclarationCustom(declaration, builder)
        return
    }

    if (declaration.property in parsers) {
        const property = propertyRename[declaration.property] ?? declaration.property

        const parser = parsers[declaration.property as keyof typeof parsers] as unknown as (
            b: typeof declaration,
            builder: StyleSheetBuilder,
            // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
        ) => StyleDescriptor | void

        const value = parser(declaration, builder)

        if (value !== undefined) {
            builder.addDescriptor(property, value)
        }
    } else {
        builder.addWarning('property', (declaration as Declaration).property)
    }

    return
}

function parseInsetBlock({ value }: DeclarationToken<'inset-block'>, builder: StyleSheetBuilder) {
    builder.addShorthand('inset-block', {
        'inset-block-start': parseLengthPercentageOrAuto(value.blockStart, builder),
        'inset-block-end': parseLengthPercentageOrAuto(value.blockEnd, builder),
    })
}

function parseInsetInline({ value }: DeclarationToken<'inset-inline'>, builder: StyleSheetBuilder) {
    builder.addShorthand('inset-inline', {
        'inset-block-start': parseLengthPercentageOrAuto(value.inlineStart, builder),
        'inset-block-end': parseLengthPercentageOrAuto(value.inlineEnd, builder),
    })
}

function parseInset({ value }: DeclarationToken<'inset'>, builder: StyleSheetBuilder) {
    builder.addShorthand('inset', {
        top: parseLengthPercentageOrAuto(value.top, builder),
        bottom: parseLengthPercentageOrAuto(value.bottom, builder),
        left: parseLengthPercentageOrAuto(value.left, builder),
        right: parseLengthPercentageOrAuto(value.right, builder),
    })
}

function parseBorderRadius(
    { value }: DeclarationToken<'border-radius'>,
    builder: StyleSheetBuilder,
) {
    builder.addShorthand('border-radius', {
        'border-bottom-left-radius': parseSize2DDimensionPercentage(value.bottomLeft, builder),
        'border-bottom-right-radius': parseSize2DDimensionPercentage(value.bottomRight, builder),
        'border-top-left-radius': parseSize2DDimensionPercentage(value.topLeft, builder),
        'border-top-right-radius': parseSize2DDimensionPercentage(value.topRight, builder),
    })
}

function parseBorderColor({ value }: DeclarationToken<'border-color'>, builder: StyleSheetBuilder) {
    builder.addShorthand('border-color', {
        'border-top-color': parseColor(value.top, builder),
        'border-bottom-color': parseColor(value.bottom, builder),
        'border-left-color': parseColor(value.left, builder),
        'border-right-color': parseColor(value.right, builder),
    })
}

function parseBorderWidth({ value }: DeclarationToken<'border-width'>, builder: StyleSheetBuilder) {
    builder.addShorthand('border-width', {
        'border-top-width': parseBorderSideWidth(value.top, builder),
        'border-bottom-width': parseBorderSideWidth(value.bottom, builder),
        'border-left-width': parseBorderSideWidth(value.left, builder),
        'border-right-width': parseBorderSideWidth(value.right, builder),
    })
}

function parseBorder({ value }: DeclarationToken<'border'>, builder: StyleSheetBuilder) {
    builder.addShorthand('border', {
        'border-width': parseBorderSideWidth(value.width, builder),
        'border-style': parseBorderStyle(value.style, builder),
        'border-color': parseColor(value.color, builder),
    })
}

function parseBorderSide(
    {
        value,
        property,
    }: DeclarationToken<'border-top' | 'border-bottom' | 'border-left' | 'border-right'>,
    builder: StyleSheetBuilder,
) {
    builder.addDescriptor(property + '-color', parseColor(value.color, builder))
    builder.addDescriptor(property + '-width', parseBorderSideWidth(value.width, builder))
}

function parseBorderBlock({ value }: DeclarationToken<'border-block'>, builder: StyleSheetBuilder) {
    builder.addDescriptor('border-top-color', parseColor(value.color, builder))
    builder.addDescriptor('border-bottom-color', parseColor(value.color, builder))
    builder.addDescriptor('border-top-width', parseBorderSideWidth(value.width, builder))
    builder.addDescriptor('border-bottom-width', parseBorderSideWidth(value.width, builder))
}

function parseBorderBlockStart(
    { value }: DeclarationToken<'border-block-start'>,
    builder: StyleSheetBuilder,
) {
    builder.addDescriptor('border-top-color', parseColor(value.color, builder))
    builder.addDescriptor('border-top-width', parseBorderSideWidth(value.width, builder))
}

function parseBorderBlockEnd(
    { value }: DeclarationToken<'border-block-end'>,
    builder: StyleSheetBuilder,
) {
    builder.addDescriptor('border-bottom-color', parseColor(value.color, builder))
    builder.addDescriptor('border-bottom-width', parseBorderSideWidth(value.width, builder))
}

function parseBorderInline(
    { value }: DeclarationToken<'border-inline'>,
    builder: StyleSheetBuilder,
) {
    builder.addDescriptor('border-left-color', parseColor(value.color, builder))
    builder.addDescriptor('border-right-color', parseColor(value.color, builder))
    builder.addDescriptor('border-left-width', parseBorderSideWidth(value.width, builder))
    builder.addDescriptor('border-right-width', parseBorderSideWidth(value.width, builder))
}

function parseBorderInlineStart(
    { value }: DeclarationToken<'border-inline-start'>,
    builder: StyleSheetBuilder,
) {
    builder.addDescriptor('border-left-color', parseColor(value.color, builder))
    builder.addDescriptor('border-left-width', parseBorderSideWidth(value.width, builder))
}

function parseBorderInlineEnd(
    { value }: DeclarationToken<'border-inline-end'>,
    builder: StyleSheetBuilder,
) {
    builder.addDescriptor('border-right-color', parseColor(value.color, builder))
    builder.addDescriptor('border-right-width', parseBorderSideWidth(value.width, builder))
}

function parseFlexFlow({ value }: DeclarationToken<'flex-flow'>, builder: StyleSheetBuilder) {
    builder.addDescriptor('flexWrap', value.wrap)
    builder.addDescriptor('flexDirection', value.direction)
}

function parseFlex({ value }: DeclarationToken<'flex'>, builder: StyleSheetBuilder) {
    builder.addDescriptor('flex-grow', value.grow)
    builder.addDescriptor('flex-shrink', value.shrink)
    builder.addDescriptor('flex-basis', parseLengthPercentageOrAuto(value.basis, builder))
}

function parseMargin({ value }: DeclarationToken<'margin'>, builder: StyleSheetBuilder) {
    builder.addShorthand('margin', {
        'margin-top': parseSize(value.top, builder, { allowAuto: true }),
        'margin-bottom': parseSize(value.bottom, builder, { allowAuto: true }),
        'margin-left': parseSize(value.left, builder, { allowAuto: true }),
        'margin-right': parseSize(value.right, builder, { allowAuto: true }),
    })
}

function parseMarginBlock({ value }: DeclarationToken<'margin-block'>, builder: StyleSheetBuilder) {
    builder.addShorthand('margin-block', {
        'margin-block-start': parseLengthPercentageOrAuto(value.blockStart, builder),
        'margin-block-end': parseLengthPercentageOrAuto(value.blockEnd, builder),
    })
}

function parseMarginInline(
    { value }: DeclarationToken<'margin-inline'>,
    builder: StyleSheetBuilder,
) {
    builder.addShorthand('margin-inline', {
        'margin-inline-start': parseLengthPercentageOrAuto(value.inlineStart, builder),
        'margin-inline-end': parseLengthPercentageOrAuto(value.inlineEnd, builder),
    })
}

function parsePadding({ value }: DeclarationToken<'padding'>, builder: StyleSheetBuilder) {
    builder.addShorthand('padding', {
        'padding-top': parseSize(value.top, builder),
        'padding-bottom': parseSize(value.bottom, builder),
        'padding-left': parseSize(value.left, builder),
        'padding-right': parseSize(value.right, builder),
    })
}

function parsePaddingBlock(
    { value }: DeclarationToken<'padding-block'>,
    builder: StyleSheetBuilder,
) {
    builder.addShorthand('padding-block', {
        'padding-block-start': parseLengthPercentageOrAuto(value.blockStart, builder),
        'padding-block-end': parseLengthPercentageOrAuto(value.blockEnd, builder),
    })
}

function parsePaddingInline(
    { value }: DeclarationToken<'padding-inline'>,
    builder: StyleSheetBuilder,
) {
    builder.addShorthand('padding-inline', {
        'padding-inline-start': parseLengthPercentageOrAuto(value.inlineStart, builder),
        'padding-inline-end': parseLengthPercentageOrAuto(value.inlineEnd, builder),
    })
}

function parseFont({ value }: DeclarationToken<'font'>, builder: StyleSheetBuilder) {
    builder.addDescriptor('font-family', value.family[0])
    builder.addDescriptor('line-height', parseLineHeight(value.lineHeight, builder))
    builder.addDescriptor('font-size', parseFontSize(value.size, builder))
    builder.addDescriptor('font-style', parseFontStyle(value.style, builder))
    builder.addDescriptor('font-variant-caps', parseFontVariantCaps(value.variantCaps, builder))
    builder.addDescriptor('font-weight', parseFontWeight(value.weight, builder))
}

function parseTransform({ value }: DeclarationToken<'transform'>, builder: StyleSheetBuilder) {
    builder.addDescriptor('transform', [
        {},
        '@transform',
        value.flatMap((t): StyleDescriptor[] => {
            switch (t.type) {
                case 'perspective':
                    return [[{}, '@perspective', [parseLength(t.value, builder)]]]
                case 'translate':
                    return [
                        [
                            {},
                            '@translateX',
                            [parseLengthOrCoercePercentageToRuntime(t.value[0], builder)],
                        ],
                        [
                            [
                                {},
                                '@translateY',
                                [parseLengthOrCoercePercentageToRuntime(t.value[1], builder)],
                            ],
                        ],
                    ]
                case 'translateX':
                    return [
                        [
                            {},
                            '@translateX',
                            [parseLengthOrCoercePercentageToRuntime(t.value, builder)],
                        ],
                    ]
                case 'translateY':
                    return [
                        [
                            {},
                            '@translateY',
                            [parseLengthOrCoercePercentageToRuntime(t.value, builder)],
                        ],
                    ]
                case 'rotate':
                    return [[{}, '@rotate', [parseAngle(t.value, builder)]]]
                case 'rotateX':
                    return [[{}, '@rotateX', [parseAngle(t.value, builder)]]]
                case 'rotateY':
                    return [[{}, '@rotateY', [parseAngle(t.value, builder)]]]
                case 'rotateZ':
                    return [[{}, '@rotateZ', [parseAngle(t.value, builder)]]]
                case 'scale':
                    return [
                        [{}, '@scaleX', [parseLength(t.value[0], builder)]],
                        [{}, '@scaleY', [parseLength(t.value[0], builder)]],
                    ]
                case 'scaleX':
                    return [[{}, 'scaleX', [parseLength(t.value, builder)]]]
                case 'scaleY':
                    return [[{}, 'scaleY', [parseLength(t.value, builder)]]]
                case 'skew':
                    return [
                        [{}, 'skewX', [parseAngle(t.value[0], builder)]],
                        [{}, 'skewY', [parseAngle(t.value[0], builder)]],
                    ]
                case 'skewX':
                    return [[{}, 'skewX', [parseAngle(t.value, builder)]]]
                case 'skewY':
                    return [[{}, 'skewY', [parseAngle(t.value, builder)]]]
                case 'translateZ':
                case 'translate3d':
                case 'scaleZ':
                case 'scale3d':
                case 'rotate3d':
                case 'matrix':
                case 'matrix3d':
                    return [[]]
            }
        }),
    ])
}

function parseTranslate({ value }: DeclarationToken<'translate'>, builder: StyleSheetBuilder) {
    builder.addDescriptor('translateX', [
        {},
        'translateX',
        [parseTranslateProp(value, 'x', builder)],
    ])
    builder.addDescriptor('translateY', [
        {},
        'translateX',
        [parseTranslateProp(value, 'y', builder)],
    ])
}

function parseRotate({ value }: DeclarationToken<'rotate'>, builder: StyleSheetBuilder) {
    builder.addDescriptor('rotateX', [{}, 'rotateX', [parseAngle(value.x, builder)]])
    builder.addDescriptor('rotateY', [{}, 'rotateY', [parseAngle(value.y, builder)]])
    builder.addDescriptor('rotateZ', [{}, 'rotateZ', [parseAngle(value.z, builder)]])
}

function parseScale({ value }: DeclarationToken<'scale'>, builder: StyleSheetBuilder) {
    builder.addDescriptor('scaleX', [{}, 'scaleX', [parseScaleValue(value, 'x', builder)]])
    builder.addDescriptor('scaleY', [{}, 'scaleY', [parseScaleValue(value, 'y', builder)]])
}

export function parseScaleValue(
    translate: Scale,
    prop: keyof Extract<Scale, object>,
    builder: StyleSheetBuilder,
): StyleDescriptor {
    if (translate === 'none') {
        return 0
    }

    return parseLength(translate[prop], builder)
}

function parseLetterSpacing(
    { value }: DeclarationToken<'letter-spacing'>,
    builder: StyleSheetBuilder,
) {
    if (value.type === 'normal') {
        return
    }
    return parseLength(value.value, builder)
}

function parseTextDecoration(
    { value }: DeclarationToken<'text-decoration'>,
    builder: StyleSheetBuilder,
) {
    builder.addDescriptor('text-decoration-color', parseColor(value.color, builder))
    builder.addDescriptor('text-decoration-line', parseTextDecorationLine(value.line, builder))
}

function parseZIndex(
    { value }: DeclarationToken<'z-index'>,
    builder: StyleSheetBuilder,
): StyleDescriptor {
    if (value.type === 'integer') {
        return parseLength(value.value, builder)
    } else {
        builder.addWarning('value', value.type)
        return
    }
}

function parseContainerType(_value: unknown, _builder: StyleSheetBuilder) {
    return
}

function parseContainerName(
    { value }: DeclarationToken<'container-name'>,
    builder: StyleSheetBuilder,
) {
    builder.addContainer(value.type === 'none' ? false : value.value)
    return
}

function parseContainer({ value }: DeclarationToken<'container'>, builder: StyleSheetBuilder) {
    builder.addContainer(value.name.type === 'none' ? false : value.name.value)
    return
}

export function parseDeclarationUnparsed(
    declaration: Extract<Declaration, { property: 'unparsed' }>,
    builder: StyleSheetBuilder,
) {
    let property = declaration.value.propertyId.property

    if (!(property in parsers)) {
        builder.addWarning('property', property)
        return
    }

    /**
     * React Native doesn't support all the logical properties
     */
    const rename = propertyRename[declaration.value.propertyId.property]
    if (rename) {
        property = rename
    }

    /**
     * Unparsed shorthand properties need to be parsed at runtime
     */
    if (needsRuntimeParsing.has(property)) {
        let args = parseUnparsed(declaration.value.value, builder)
        if (!isStyleDescriptorArray(args)) {
            args = [args]
        }

        if (property === 'animation') {
            builder.addDescriptor('animation', [{}, `@${toRNProperty(property)}`, args])
        } else {
            builder.addDescriptor(property, [{}, `@${toRNProperty(property)}`, args, 1])
        }
    } else {
        builder.addDescriptor(property, parseUnparsed(declaration.value.value, builder))
    }
}

export function parseDeclarationCustom(
    declaration: Extract<Declaration, { property: 'custom' }>,
    builder: StyleSheetBuilder,
) {
    const property = declaration.value.name
    if (
        validCssStyleProperties.has(property) ||
        property.startsWith('--') ||
        property.startsWith('-rn-')
    ) {
        builder.addDescriptor(
            property,
            parseUnparsed(declaration.value.value, builder, allowAuto.has(property)),
        )
    } else {
        builder.addWarning('property', declaration.value.name)
    }
}

export function reduceParseUnparsed(
    tokenOrValues: TokenOrValue[],
    builder: StyleSheetBuilder,
): StyleDescriptor[] | undefined {
    const result = tokenOrValues
        .map(tokenOrValue => parseUnparsed(tokenOrValue, builder))
        .filter(v => v !== undefined)

    if (result.length === 0) {
        return undefined
    }

    let currentGroup: StyleDescriptor[] = []
    const groups: StyleDescriptor[][] = [currentGroup]

    for (const value of result) {
        if ((value as unknown) === CommaSeparator) {
            currentGroup = []
            groups.push(currentGroup)
        } else {
            currentGroup.push(value)
        }
    }

    return groups.length === 1 ? groups[0] : groups
}

export function unparsedFunction(
    token: Extract<TokenOrValue, { type: 'function' }>,
    builder: StyleSheetBuilder,
): StyleFunction {
    const args = reduceParseUnparsed(token.value.arguments, builder)
    return [{}, token.value.name, args]
}

/**
 * When the CSS cannot be parsed (often due to a runtime condition like a CSS variable)
 * This export function best efforts parsing it into a export function that we can evaluate at runtime
 */
export function parseUnparsed(
    tokenOrValue: TokenOrValue | TokenOrValue[] | string | number | undefined | null,
    builder: StyleSheetBuilder,
    allowAuto = false,
): StyleDescriptor {
    if (tokenOrValue === undefined || tokenOrValue === null) {
        return
    }

    if (typeof tokenOrValue === 'string') {
        if (tokenOrValue === 'true') {
            return true
        } else if (tokenOrValue === 'false') {
            return false
        } else {
            return tokenOrValue
        }
    }

    if (typeof tokenOrValue === 'number') {
        return round(tokenOrValue)
    }

    if (Array.isArray(tokenOrValue)) {
        const args = reduceParseUnparsed(tokenOrValue, builder)
        if (!args) return
        if (args.length === 1) return args[0]
        return args
    }

    switch (tokenOrValue.type) {
        case 'unresolved-color': {
            return parseUnresolvedColor(tokenOrValue.value, builder)
        }
        case 'var': {
            const args: StyleDescriptor[] = [tokenOrValue.value.name.ident.slice(2)]
            const fallback = parseUnparsed(tokenOrValue.value.fallback, builder)
            if (fallback !== undefined) {
                args.push(fallback)
            }

            return [{}, 'var', args, 1]
        }
        case 'function': {
            switch (tokenOrValue.value.name) {
                case 'translate':
                case 'rotate':
                case 'rotateX':
                case 'rotateY':
                case 'skewX':
                case 'skewY':
                case 'scale':
                case 'scaleX':
                case 'scaleY':
                case 'translateX':
                case 'translateY':
                    tokenOrValue.value.name = `@${tokenOrValue.value.name}`
                    return unparsedFunction(tokenOrValue, builder)
                case 'platformColor':
                case 'pixelSizeForLayoutSize':
                case 'roundToNearestPixel':
                case 'pixelScale':
                case 'fontScale':
                case 'shadow':
                case 'rgb':
                case 'rgba':
                case 'hsl':
                case 'hsla':
                case 'linear-gradient':
                case 'radial-gradient':
                    return unparsedFunction(tokenOrValue, builder)
                case 'hairlineWidth':
                    return [{}, tokenOrValue.value.name, []]
                case 'calc':
                case 'max':
                case 'min':
                case 'clamp':
                    return parseCalcFn(
                        tokenOrValue.value.name,
                        tokenOrValue.value.arguments,
                        builder,
                    )
                default: {
                    builder.addWarning('function', tokenOrValue.value.name)
                    return
                }
            }
        }
        case 'length':
            return parseLength(tokenOrValue.value, builder)
        case 'angle':
            return parseAngle(tokenOrValue.value, builder)
        case 'token':
            switch (tokenOrValue.value.type) {
                case 'string':
                case 'number':
                case 'ident': {
                    const value = tokenOrValue.value.value
                    if (typeof value === 'string') {
                        if (!allowAuto && value === 'auto') {
                            builder.addWarning('value', value)
                            return
                        }

                        if (value === 'inherit') {
                            builder.addWarning('value', value)
                            return
                        }

                        if (value === 'true') {
                            return true
                        } else if (value === 'false') {
                            return false
                        } else {
                            return value
                        }
                    } else {
                        return value
                    }
                }
                case 'function':
                    builder.addWarning('value', tokenOrValue.value.value)
                    return
                case 'percentage':
                    return `${round(tokenOrValue.value.value * 100)}%`
                case 'dimension':
                    return parseDimension(tokenOrValue.value, builder)
                case 'comma':
                    return CommaSeparator as unknown as StyleDescriptor
                case 'at-keyword':
                case 'hash':
                case 'id-hash':
                case 'unquoted-url':
                case 'delim':
                case 'white-space':
                case 'comment':
                case 'colon':
                case 'semicolon':
                case 'include-match':
                case 'dash-match':
                case 'prefix-match':
                case 'suffix-match':
                case 'substring-match':
                case 'cdo':
                case 'cdc':
                case 'parenthesis-block':
                case 'square-bracket-block':
                case 'curly-bracket-block':
                case 'bad-url':
                case 'bad-string':
                case 'close-parenthesis':
                case 'close-square-bracket':
                case 'close-curly-bracket':
                    return
                default: {
                    tokenOrValue.value satisfies never
                    return
                }
            }
        case 'color':
            return parseColor(tokenOrValue.value, builder)
        case 'env':
            return parseEnv(tokenOrValue.value, builder)
        case 'time':
            return parseTime(tokenOrValue.value)
        case 'url':
        case 'resolution':
        case 'dashed-ident':
        case 'animation-name':
            return
        default: {
            tokenOrValue satisfies never
        }
    }

    return
}

export function parseLengthDeclaration(
    declaration: {
        value:
            | number
            | Length
            | DimensionPercentageFor_LengthValue
            | NumberOrPercentage
            | LengthValue
    },
    builder: StyleSheetBuilder,
) {
    return parseLength(declaration.value, builder)
}

export function parseLength(
    length: number | Length | DimensionPercentageFor_LengthValue | NumberOrPercentage | LengthValue,
    builder: StyleSheetBuilder,
): StyleDescriptor {
    const { inlineRem = 14 } = builder.getOptions()

    if (typeof length === 'number') {
        return length
    }

    if ('unit' in length) {
        switch (length.unit) {
            case 'px':
                return length.value
            case 'rem':
                if (typeof inlineRem === 'number') {
                    return length.value * inlineRem
                } else {
                    return [{}, 'rem', [length.value]]
                }
            case 'vw':
            case 'vh':
            case 'em':
                return [{}, length.unit, [length.value], 1]
            case 'in':
            case 'cm':
            case 'mm':
            case 'q':
            case 'pt':
            case 'pc':
            case 'ex':
            case 'rex':
            case 'ch':
            case 'rch':
            case 'cap':
            case 'rcap':
            case 'ic':
            case 'ric':
            case 'lh':
            case 'rlh':
            case 'lvw':
            case 'svw':
            case 'dvw':
            case 'cqw':
            case 'lvh':
            case 'svh':
            case 'dvh':
            case 'cqh':
            case 'vi':
            case 'svi':
            case 'lvi':
            case 'dvi':
            case 'cqi':
            case 'vb':
            case 'svb':
            case 'lvb':
            case 'dvb':
            case 'cqb':
            case 'vmin':
            case 'svmin':
            case 'lvmin':
            case 'dvmin':
            case 'cqmin':
            case 'vmax':
            case 'svmax':
            case 'lvmax':
            case 'dvmax':
            case 'cqmax':
                builder.addWarning('value', `${length.value}${length.unit}`)
                return undefined
            default: {
                length.unit satisfies never
            }
        }
    } else {
        switch (length.type) {
            case 'calc': {
                // TODO: Add the calc polyfill
                return undefined
            }
            case 'number': {
                return round(length.value)
            }
            case 'percentage': {
                return `${round(length.value * 100)}%`
            }
            case 'dimension':
            case 'value': {
                return parseLength(length.value, builder)
            }
        }
    }

    return
}

export function parseAngle(angle: Angle | number, builder: StyleSheetBuilder) {
    if (typeof angle === 'number') {
        return `${angle}deg`
    }

    switch (angle.type) {
        case 'deg':
        case 'rad':
            return `${angle.value}${angle.type}`
        default:
            builder.addWarning('value', angle.value)
            return undefined
    }
}

export function parseSizeDeclaration(
    declaration: { value: Size | MaxSize },
    builder: StyleSheetBuilder,
) {
    return parseSize(declaration.value, builder)
}

export function parsePointerEvents({ value }: { value: string }, builder: StyleSheetBuilder) {
    switch (value) {
        case 'none':
        case 'box-none':
        case 'box-only':
        case 'auto':
            return value
        case 'visible':
        case 'visiblePainted':
        case 'visibleFill':
        case 'visibleStroke':
        case 'painted':
        case 'fill':
        case 'stroke':
            builder.addWarning('value', value)
    }

    return
}

export function parseSize(
    size: Size | MaxSize,
    builder: StyleSheetBuilder,
    options?: { allowAuto?: boolean },
): StyleDescriptor
export function parseSize(
    size: Size | MaxSize,
    builder: StyleSheetBuilder,
    property: string,
    options?: { allowAuto?: boolean },
): StyleDescriptor
export function parseSize(
    size: Size | MaxSize,
    builder: StyleSheetBuilder,
    options?: string | { allowAuto?: boolean },
    { allowAuto = false } = {},
) {
    allowAuto = (typeof options === 'object' ? options.allowAuto : allowAuto) ?? false

    switch (size.type) {
        case 'length-percentage':
            return parseLength(size.value, builder)
        case 'none':
            return size.type
        case 'auto':
            if (allowAuto) {
                return size.type
            } else {
                builder.addWarning('value', size.type)
                return undefined
            }
        case 'min-content':
        case 'max-content':
        case 'fit-content':
        case 'fit-content-function':
        case 'stretch':
        case 'contain':
            builder.addWarning('value', size.type)
            return undefined
        default: {
            size satisfies never
        }
    }

    return
}

export function parseColorOrAuto({ value }: { value: ColorOrAuto }, builder: StyleSheetBuilder) {
    if (value.type === 'auto') {
        builder.addWarning('value', `Invalid color value ${value.type}`)
        return
    } else {
        return parseColor(value.value, builder)
    }
}

export function parseColorDeclaration(
    declaration: { value: CssColor },
    builder: StyleSheetBuilder,
) {
    return parseColor(declaration.value, builder)
}

export function parseColor(cssColor: CssColor, builder: StyleSheetBuilder) {
    if (typeof cssColor === 'string') {
        return cssColorNames.has(cssColor) ? cssColor : undefined
    }

    let color: Color | undefined

    const { hexColors = false, colorPrecision } = builder.getOptions()

    switch (cssColor.type) {
        case 'currentcolor':
            builder.addWarning('value', cssColor.type)
            return
        case 'light-dark':
            // TODO: Handle light-dark colors
            return
        case 'rgb': {
            color = new Color({
                space: 'sRGB',
                coords: [cssColor.r / 255, cssColor.g / 255, cssColor.b / 255],
                alpha: cssColor.alpha,
            })
            break
        }
        case 'hsl':
            color = new Color({
                space: cssColor.type,
                coords: [cssColor.h, cssColor.s, cssColor.l],
                alpha: cssColor.alpha,
            })
            break
        case 'hwb':
            color = new Color({
                space: cssColor.type,
                coords: [cssColor.h, cssColor.w, cssColor.b],
                alpha: cssColor.alpha,
            })
            break
        case 'lab':
            color = new Color({
                space: cssColor.type,
                coords: [cssColor.l, cssColor.a, cssColor.b],
                alpha: cssColor.alpha,
            })
            break
        case 'lch':
            color = new Color({
                space: cssColor.type,
                coords: [cssColor.l, cssColor.c, cssColor.h],
                alpha: cssColor.alpha,
            })
            break
        case 'oklab':
            color = new Color({
                space: cssColor.type,
                coords: [cssColor.l, cssColor.a, cssColor.b],
                alpha: cssColor.alpha,
            })
            break
        case 'oklch':
            color = new Color({
                space: cssColor.type,
                coords: [cssColor.l, cssColor.c, cssColor.h],
                alpha: cssColor.alpha,
            })
            break
        case 'srgb':
            color = new Color({
                space: cssColor.type,
                coords: [cssColor.r, cssColor.g, cssColor.b],
                alpha: cssColor.alpha,
            })
            break
        case 'srgb-linear':
            color = new Color({
                space: cssColor.type,
                coords: [cssColor.r, cssColor.g, cssColor.b],
                alpha: cssColor.alpha,
            })
            break
        case 'display-p3':
            color = new Color({
                space: 'p3',
                coords: [cssColor.r, cssColor.g, cssColor.b],
                alpha: cssColor.alpha,
            })
            break
        case 'a98-rgb':
            color = new Color({
                space: 'a98rgb',
                coords: [cssColor.r, cssColor.g, cssColor.b],
                alpha: cssColor.alpha,
            })
            break
        case 'prophoto-rgb':
            color = new Color({
                space: 'prophoto',
                coords: [cssColor.r, cssColor.g, cssColor.b],
                alpha: cssColor.alpha,
            })
            break
        case 'rec2020':
            color = new Color({
                space: cssColor.type,
                coords: [cssColor.r, cssColor.g, cssColor.b],
                alpha: cssColor.alpha,
            })
            break
        case 'xyz-d50':
            color = new Color({
                space: cssColor.type,
                coords: [cssColor.x, cssColor.y, cssColor.z],
                alpha: cssColor.alpha,
            })
            break
        case 'xyz-d65':
            color = new Color({
                space: cssColor.type,
                coords: [cssColor.x, cssColor.y, cssColor.z],
                alpha: cssColor.alpha,
            })
            break
        default: {
            cssColor satisfies never
        }
    }

    if (!hexColors || colorPrecision) {
        return color?.toString({ precision: colorPrecision ?? 3 })
    } else {
        return color?.toString({ format: 'hex' })
    }
}

export function parseLengthPercentageOrAutoDeclaration(
    value: { value: LengthPercentageOrAuto },
    builder: StyleSheetBuilder,
) {
    return parseLengthPercentageOrAuto(value.value, builder)
}

export function parseLengthPercentageOrAuto(
    lengthPercentageOrAuto: LengthPercentageOrAuto,
    builder: StyleSheetBuilder,
    { allowAuto = false } = {},
) {
    switch (lengthPercentageOrAuto.type) {
        case 'auto':
            if (allowAuto) {
                return lengthPercentageOrAuto.type
            } else {
                builder.addWarning('value', lengthPercentageOrAuto.type)
                return undefined
            }
        case 'length-percentage':
            return parseLength(lengthPercentageOrAuto.value, builder)
        default: {
            lengthPercentageOrAuto satisfies never
        }
    }

    return
}

export function parseJustifyContent(
    declaration: DeclarationToken<'justify-content'>,
    builder: StyleSheetBuilder,
) {
    const allowed = new Set([
        'flex-start',
        'flex-end',
        'center',
        'space-between',
        'space-around',
        'space-evenly',
    ])

    let value: string | undefined

    switch (declaration.value.type) {
        case 'normal':
        case 'left':
        case 'right':
            value = declaration.value.type
            break
        case 'content-distribution':
        case 'content-position':
            value = declaration.value.value
            break
        default: {
            declaration.value satisfies never
        }
    }

    if (value && !allowed.has(value)) {
        builder.addWarning('value', value)
        return
    }

    return value
}

export function parseAlignContent(
    declaration: DeclarationToken<'align-content'>,
    builder: StyleSheetBuilder,
) {
    const allowed = new Set([
        'flex-start',
        'flex-end',
        'center',
        'stretch',
        'space-between',
        'space-around',
    ])

    let value: string | undefined

    switch (declaration.value.type) {
        case 'normal':
        case 'baseline-position':
            value = declaration.value.type
            break
        case 'content-distribution':
        case 'content-position':
            value = declaration.value.value
            break
        default: {
            declaration.value satisfies never
        }
    }

    if (value && !allowed.has(value)) {
        builder.addWarning('value', value)
        return
    }

    return value
}

export function parseAlignItems(
    alignItems: DeclarationToken<'align-items'>,
    builder: StyleSheetBuilder,
) {
    const allowed = new Set(['flex-start', 'flex-end', 'center', 'stretch', 'baseline'])

    let value: string | undefined

    switch (alignItems.value.type) {
        case 'stretch':
            // In RN, stretch is the default value for align-items
            value = alignItems.value.type
            break
        case 'baseline-position':
            value = 'baseline'
            break
        case 'self-position':
            value = alignItems.value.value
            break
        default: {
            alignItems.value satisfies never
        }
    }

    if (value && !allowed.has(value)) {
        builder.addWarning('value', value)
        return
    }

    return value
}

export function parseAlignSelf(
    alignSelf: DeclarationToken<'align-self'>,
    builder: StyleSheetBuilder,
) {
    const allowed = new Set(['auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline'])

    let value: string | undefined

    switch (alignSelf.value.type) {
        case 'normal':
        case 'auto':
            value = 'auto'
            break
        case 'stretch':
            value = alignSelf.value.type
            break
        case 'baseline-position':
            value = 'baseline'
            break
        case 'self-position':
            value = alignSelf.value.value
            break
        default: {
            alignSelf.value satisfies never
        }
    }

    if (value && !allowed.has(value)) {
        builder.addWarning('value', value)
        return
    }

    return value
}

export function parseFontWeightDeclaration(
    declaration: DeclarationToken<'font-weight'>,
    builder: StyleSheetBuilder,
) {
    return parseFontWeight(declaration.value, builder)
}

export function parseFontWeight(fontWeight: FontWeight, builder: StyleSheetBuilder) {
    switch (fontWeight.type) {
        case 'absolute':
            if (fontWeight.value.type === 'weight') {
                return fontWeight.value.value.toString()
            } else {
                return fontWeight.value.type
            }
        case 'bolder':
        case 'lighter':
            builder.addWarning('value', fontWeight.type)
            return
        default: {
            fontWeight satisfies never
        }
    }

    return
}

export function parseTextShadow(
    declaration: DeclarationToken<'text-shadow'>,
    builder: StyleSheetBuilder,
) {
    const [textShadow] = declaration.value

    if (!textShadow) {
        return
    }
    builder.addDescriptor('textShadowColor', parseColor(textShadow.color, builder))
    builder.addDescriptor('textShadowOffset.width', parseLength(textShadow.xOffset, builder))
    builder.addDescriptor('textShadowOffset.height', parseLength(textShadow.yOffset, builder))
    builder.addDescriptor('textShadowRadius', parseLength(textShadow.blur, builder))
}

export function parseTextDecorationStyle(
    declaration: DeclarationToken<'text-decoration-style'>,
    builder: StyleSheetBuilder,
) {
    const allowed = new Set(['solid', 'double', 'dotted', 'dashed'])

    if (allowed.has(declaration.value)) {
        return declaration.value
    }

    builder.addWarning('value', declaration.value)
    return
}

export function parseTextDecorationLineDeclaration(
    declaration: DeclarationToken<'text-decoration-line'>,
    builder: StyleSheetBuilder,
) {
    return parseTextDecorationLine(declaration.value, builder)
}

export function parseTextDecorationLine(
    value: DeclarationToken<'text-decoration-line'>['value'],
    builder: StyleSheetBuilder,
) {
    if (!Array.isArray(value)) {
        if (value === 'none') {
            return value
        }
        builder.addWarning('value', value)
        return
    }

    const set = new Set(value)

    if (set.has('underline')) {
        if (set.has('line-through')) {
            return 'underline line-through'
        } else {
            return 'underline'
        }
    } else if (set.has('line-through')) {
        return 'line-through'
    }

    builder.addWarning('value', value.join(' '))
    return undefined
}

export function parsePosition({ value }: DeclarationToken<'position'>, builder: StyleSheetBuilder) {
    if (value.type === 'absolute' || value.type === 'relative') {
        return value.type
    }

    builder.addWarning('value', value.type)
    return
}

export function parseOverflow({ value }: DeclarationToken<'overflow'>, builder: StyleSheetBuilder) {
    const allowed = new Set(['visible', 'hidden'])

    if (allowed.has(value.x)) {
        return value.x
    }

    builder.addWarning('value', value.x)
    return undefined
}

export function parseBorderStyleDeclaration(
    declaration: DeclarationToken<'border-style'>,
    builder: StyleSheetBuilder,
) {
    return parseBorderStyle(declaration.value, builder)
}

export function parseBorderStyle(value: BorderStyle | LineStyle, builder: StyleSheetBuilder) {
    const allowed = new Set(['solid', 'dotted', 'dashed'])

    if (typeof value === 'string') {
        if (allowed.has(value)) {
            return value
        } else {
            builder.addWarning('value', value)
            return undefined
        }
    } else if (
        value.top === value.bottom &&
        value.top === value.left &&
        value.top === value.right &&
        allowed.has(value.top)
    ) {
        return value.top
    }

    builder.addWarning('value', value.top)

    return undefined
}

export function parseBorderBlockColor(
    { value }: { value: BorderBlockColor },
    builder: StyleSheetBuilder,
) {
    builder.addDescriptor('border-top-color', parseColor(value.start, builder))
    builder.addDescriptor('border-bottom-color', parseColor(value.end, builder))
    return
}

export function parseBorderBlockWidth(
    declaration: DeclarationToken<'border-block-width' | 'border-inline-width'>,
    builder: StyleSheetBuilder,
) {
    builder.addDescriptor(
        'border-top-width',
        parseBorderSideWidth(declaration.value.start, builder),
    )
    builder.addDescriptor(
        'border-bottom-width',
        parseBorderSideWidth(declaration.value.end, builder),
    )
}

export function parseBorderSideWidthDeclaration(
    declaration: { value: BorderSideWidth },
    builder: StyleSheetBuilder,
) {
    return parseBorderSideWidth(declaration.value, builder)
}

export function parseBorderSideWidth(value: BorderSideWidth, builder: StyleSheetBuilder) {
    if (value.type === 'length') {
        return parseLength(value.value, builder)
    }

    builder.addWarning('value', value.type)
    return undefined
}

export function parseVerticalAlign(
    { value }: DeclarationToken<'vertical-align'>,
    builder: StyleSheetBuilder,
) {
    if (value.type === 'length') {
        return undefined
    }

    const allowed = new Set(['auto', 'top', 'bottom', 'middle'])

    if (allowed.has(value.value)) {
        return value.value
    }

    builder.addWarning('value', value.value)
    return undefined
}

function parseFontFamily({ value }: DeclarationToken<'font-family'>) {
    // React Native only allows one font family - better hope this is the right one :)
    return value[0]
}

export function parseLineHeightDeclaration(
    declaration: DeclarationToken<'line-height'>,
    builder: StyleSheetBuilder,
) {
    return parseLineHeight(declaration.value, builder)
}

export function parseLineHeight(
    tokenValue: LineHeight,
    builder: StyleSheetBuilder,
): StyleDescriptor {
    const { type } = tokenValue

    if (!('value' in tokenValue)) {
        // When `type` is "normal" there is no `value`
        return undefined
    }

    if (type === 'number') {
        return toStyleFunctionDescriptor({
            property: 'line-height',
            value: tokenValue.value,
        })
    }
    switch (type) {
        case 'normal':
            return undefined
        case 'number':
            return [{}, 'em', [value.value], 1]
        case 'length': {
            const length = value.value

            switch (length.type) {
                case 'dimension':
                    return parseLength(length, builder)
                case 'percentage':
                case 'calc':
                    builder.addWarning(
                        'value',
                        typeof length.value === 'number' ?
                            length.value
                        :   JSON.stringify(length.value),
                    )
                    return
                default: {
                    length satisfies never
                }
            }

            return
        }
        default: {
            value satisfies never
        }
    }

    return
}

export function parseFontSizeDeclaration(
    declaration: DeclarationToken<'font-size'>,
    builder: StyleSheetBuilder,
) {
    const fontSize = parseFontSize(declaration.value, builder)
    builder.addDescriptor('fontSize', fontSize)
    builder.addDescriptor(`--${RN_CSS_EM_PREFIX}`, fontSize)
}

export function parseFontSize(value: FontSize, builder: StyleSheetBuilder) {
    switch (value.type) {
        case 'length':
            return parseLength(value.value, builder)
        case 'absolute':
        case 'relative':
            builder.addWarning('value', value.value)
            return undefined
        default: {
            value satisfies never
        }
    }

    return
}

export function parseFontStyleDeclaration(
    declaration: DeclarationToken<'font-style'>,
    builder: StyleSheetBuilder,
) {
    return parseFontStyle(declaration.value, builder)
}

export function parseFontStyle(value: FontStyle, builder: StyleSheetBuilder) {
    switch (value.type) {
        case 'normal':
        case 'italic':
            return value.type
        case 'oblique':
            builder.addWarning('value', value.type)
            return undefined
        default: {
            value satisfies never
        }
    }

    return
}

export function parseFontVariantCapsDeclaration(
    declaration: DeclarationToken<'font-variant-caps'>,
    builder: StyleSheetBuilder,
) {
    return parseFontVariantCaps(declaration.value, builder)
}

export function parseFontVariantCaps(value: FontVariantCaps, builder: StyleSheetBuilder) {
    const allowed = new Set([
        'small-caps',
        'oldstyle-nums',
        'lining-nums',
        'tabular-nums',
        'proportional-nums',
    ])
    if (allowed.has(value)) {
        return value
    }

    builder.addWarning('value', value)
    return undefined
}

export function parseLengthOrCoercePercentageToRuntime(
    value: Length | DimensionPercentageFor_LengthValue | NumberOrPercentage,
    builder: StyleSheetBuilder,
): StyleDescriptor {
    return parseLength(value, builder)
}

export function parseGap(
    declaration: DeclarationToken<'gap' | 'column-gap' | 'row-gap'>,
    builder: StyleSheetBuilder,
) {
    if ('column' in declaration.value) {
        builder.addDescriptor('row-gap', parseGap(declaration, builder))
        builder.addDescriptor('column-gap', parseGap(declaration, builder))

        return
    } else {
        if (declaration.value.type === 'normal') {
            builder.addWarning('value', declaration.value.type)
            return
        }

        return parseLength(declaration.value.value, builder)
    }
}

export function parseTextAlign(
    { value }: DeclarationToken<'text-align'>,
    builder: StyleSheetBuilder,
) {
    const allowed = new Set(['auto', 'left', 'right', 'center', 'justify'])
    if (allowed.has(value)) {
        return value
    }

    builder.addWarning('value', value)
    return undefined
}

export function parseBoxShadow(_: DeclarationToken<'box-shadow'>, _builder: StyleSheetBuilder) {
    return undefined

    // return value.map(
    //   (shadow): BoxShadowValue => ({
    //     color: parseColor(shadow.color, builder),
    //     offsetX: parseLength(shadow.xOffset, builder) as number,
    //     offsetY: parseLength(shadow.yOffset, builder) as number,
    //     blurRadius: parseLength(shadow.blur, builder) as number,
    //     spreadDistance: parseLength(shadow.spread, builder) as number,
    //     inset: shadow.inset,
    //   }),
    // );
}

export function parseDisplay({ value }: DeclarationToken<'display'>, builder: StyleSheetBuilder) {
    if (value.type === 'keyword') {
        if (value.value === 'none') {
            return value.value
        } else {
            builder.addWarning('value', value.value)
            return
        }
    } else {
        if (value.outside === 'block') {
            switch (value.inside.type) {
                case 'flow':
                    if (value.isListItem) {
                        builder.addWarning('value', 'list-item')
                    } else {
                        builder.addWarning('value', 'block')
                    }
                    return
                case 'flex':
                    return value.inside.type
                case 'flow-root':
                case 'table':
                case 'box':
                case 'grid':
                case 'ruby':
                    builder.addWarning('value', value.inside.type)
                    return
            }
        } else {
            switch (value.inside.type) {
                case 'flow':
                    builder.addWarning('value', 'inline')
                    return
                case 'flow-root':
                    builder.addWarning('value', 'inline-block')
                    return
                case 'table':
                    builder.addWarning('value', 'inline-table')
                    return
                case 'flex':
                    builder.addWarning('value', 'inline-flex')
                    return
                case 'box':
                case 'grid':
                    builder.addWarning('value', 'inline-grid')
                    return
                case 'ruby':
                    builder.addWarning('value', value.inside.type)
                    return
            }
        }
    }
}

export function parseAspectRatio({ value }: DeclarationToken<'aspect-ratio'>): StyleDescriptor {
    if (!value.ratio) {
        return
    } else if (value.auto) {
        return 'auto'
    } else {
        const [width, height] = value.ratio
        if (width === height) {
            return 1
        } else {
            return `${width}/${height}`
        }
    }
}

export function parseDimension(
    { unit, value }: Extract<Token, { type: 'dimension' }>,
    builder: StyleSheetBuilder,
): StyleDescriptor {
    switch (unit) {
        case 'px':
            return value
        case '%':
            return `${value}%`
        case 'rnh':
        case 'rnw':
            return [{}, unit, [value / 100], 1]
        default: {
            builder.addWarning('value', `${value}${unit}`)
            return
        }
    }
}

export function parseUserSelect(
    { value }: DeclarationToken<'user-select'>,
    builder: StyleSheetBuilder,
) {
    const allowed = ['auto', 'text', 'none', 'contain', 'all']
    if (allowed.includes(value)) {
        return value
    } else {
        builder.addWarning('value', value)
        return
    }
}

export function parseSVGPaint(
    { value }: DeclarationToken<'fill' | 'stroke'>,
    builder: StyleSheetBuilder,
) {
    if (value.type === 'none') {
        return 'transparent'
    } else if (value.type === 'color') {
        return parseColor(value.value, builder)
    }

    return
}

export function round(number: number) {
    return Math.round((number + Number.EPSILON) * 100) / 100
}

export function parseDimensionPercentageFor_LengthValue(
    value: DimensionPercentageFor_LengthValue,
    builder: StyleSheetBuilder,
) {
    if (value.type === 'calc') {
        return undefined
    } else if (value.type === 'percentage') {
        return `${value.value}%`
    } else {
        return parseLength(value.value, builder)
    }
}

const allowAuto = new Set(['pointer-events'])

export function parseEnv(
    value: EnvironmentVariable,
    builder: StyleSheetBuilder,
): StyleFunction | undefined {
    switch (value.name.type) {
        case 'ua':
            switch (value.name.value) {
                case 'safe-area-inset-top':
                case 'safe-area-inset-right':
                case 'safe-area-inset-bottom':
                case 'safe-area-inset-left':
                    return [
                        {},
                        'var',
                        [
                            `--react-native-css-${value.name.value}`,
                            parseUnparsed(value.fallback, builder),
                        ],
                        1,
                    ]
                case 'viewport-segment-width':
                case 'viewport-segment-height':
                case 'viewport-segment-top':
                case 'viewport-segment-left':
                case 'viewport-segment-bottom':
                case 'viewport-segment-right':
            }
            break
        case 'custom':
        case 'unknown':
    }

    return
}

export function parseCalcFn(
    name: string,
    tokens: TokenOrValue[],
    builder: StyleSheetBuilder,
): StyleDescriptor {
    const args = parseCalcArguments(tokens, builder)
    if (args) {
        return [{}, name, args]
    }

    return
}

export function parseCalcArguments([...args]: TokenOrValue[], builder: StyleSheetBuilder) {
    const parsed: StyleDescriptor[] = []

    let mode: 'number' | 'percentage' | undefined

    for (const [currentIndex, arg] of args.entries()) {
        switch (arg.type) {
            case 'env': {
                parsed.push(parseEnv(arg.value, builder))
                break
            }
            case 'var':
            case 'function':
            case 'unresolved-color': {
                const value = parseUnparsed(arg, builder)

                if (value === undefined) {
                    return undefined
                }

                parsed.push(value)
                break
            }
            case 'length': {
                const value = parseLength(arg.value, builder)

                if (value !== undefined) {
                    parsed.push(value)
                }

                break
            }
            case 'color':
            case 'url':
            case 'angle':
            case 'time':
            case 'resolution':
            case 'dashed-ident':
                break
            case 'token':
                switch (arg.value.type) {
                    case 'delim':
                        if (['+', '-', '*', '/'].includes(arg.value.value)) {
                            parsed.push(arg.value.value)
                        }
                        break
                    case 'percentage':
                        mode ??= 'percentage'
                        if (mode !== 'percentage') return
                        parsed.push(`${arg.value.value * 100}%`)
                        break
                    case 'number': {
                        mode ??= 'number'
                        if (mode !== 'number') return
                        parsed.push(arg.value.value)
                        break
                    }
                    case 'parenthesis-block': {
                        /**
                         * If we have a parenthesis block, we just treat it as a nested calc function
                         * Because there could be multiple parenthesis blocks, this is recursive
                         */
                        let closeParenthesisIndex = -1
                        for (let index = args.length - 1; index > 0; index--) {
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            const value = args[index]!
                            if (
                                value.type === 'token' &&
                                value.value.type === 'close-parenthesis'
                            ) {
                                closeParenthesisIndex = index
                                break
                            }
                        }

                        if (closeParenthesisIndex === -1) {
                            return
                        }

                        const innerCalcArgs = args
                            // Extract the inner calcArgs including the parenthesis. This mutates args
                            .splice(currentIndex, closeParenthesisIndex - currentIndex + 1)
                            // Then drop the surrounding parenthesis
                            .slice(1, -1)

                        parsed.push(parseCalcFn('calc', innerCalcArgs, builder))

                        break
                    }
                    // case 'close-parenthesis':
                    // case 'string':
                    // case 'function':
                    // case 'ident':
                    // case 'at-keyword':
                    // case 'hash':
                    // case 'id-hash':
                    // case 'unquoted-url':
                    // case 'dimension':
                    // case 'white-space':
                    // case 'comment':
                    // case 'colon':
                    // case 'semicolon':
                    // case 'comma':
                    // case 'include-match':
                    // case 'dash-match':
                    // case 'prefix-match':
                    // case 'suffix-match':
                    // case 'substring-match':
                    // case 'cdo':
                    // case 'cdc':
                    // case 'square-bracket-block':
                    // case 'curly-bracket-block':
                    // case 'bad-url':
                    // case 'bad-string':
                    // case 'close-square-bracket':
                    // case 'close-curly-bracket':
                    // default:
                }
        }
    }

    return parsed
}

export function parseTranslateProp(
    value: Translate,
    prop: keyof Extract<Translate, object>,
    builder: StyleSheetBuilder,
): StyleDescriptor {
    if (value === 'none') {
        return 0
    }

    return parseLength(value[prop], builder)
}

export function parseUnresolvedColor(
    color: UnresolvedColor,
    builder: StyleSheetBuilder,
): StyleDescriptor {
    switch (color.type) {
        case 'rgb':
            return [
                {},
                'rgba',
                [
                    round(color.r * 255),
                    round(color.g * 255),
                    round(color.b * 255),
                    parseUnparsed(color.alpha, builder),
                ],
            ]
        case 'hsl':
            return [
                {},
                color.type,
                [color.h, color.s, color.l, parseUnparsed(color.alpha, builder)],
            ]
        case 'light-dark':
            return undefined
        default:
            color satisfies never
    }

    return
}

export function allEqual(...params: unknown[]) {
    return params.every((param, index, array) => {
        return index === 0 ? true : equal(array[0], param)
    })
}
export function equal(a: unknown, b: unknown) {
    if (a === b) return true
    if (typeof a !== typeof b) return false
    if (a === null || b === null) return false
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false
        for (let i = 0; i < a.length; i++) {
            if (!equal(a[i], b[i])) return false
        }
        return true
    }
    if (typeof a === 'object' && typeof b === 'object') {
        if (Object.keys(a).length !== Object.keys(b).length) return false
        for (const key in a) {
            if (!equal((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]))
                return false
        }
        return true
    }

    return false
}

export function parseTime(time: Time) {
    return time.type === 'milliseconds' ? time.value : time.value * 1000
}

export function parseSize2DDimensionPercentageDeclaration(
    declaration: { value: Size2DFor_DimensionPercentageFor_LengthValue },
    builder: StyleSheetBuilder,
) {
    return parseSize2DDimensionPercentage(declaration.value, builder)
}

export function parseSize2DDimensionPercentage(
    value: Size2DFor_DimensionPercentageFor_LengthValue,
    builder: StyleSheetBuilder,
) {
    return parseLength(value[0], builder)
}

export function addTransitionValue(
    declaration: Extract<Declaration, { property: `transition${string}` | 'transition' }>,
    builder: StyleSheetBuilder,
) {
    switch (declaration.property) {
        case 'transition': {
            const grouped: Record<string, unknown[]> = {}

            for (const animation of declaration.value) {
                for (const [key, value] of Object.entries(animation)) {
                    grouped[key] ??= []
                    grouped[key].push(value)
                }
            }

            for (const [property, value] of Object.entries(grouped)) {
                addTransitionValue(
                    {
                        property: `transition-${kebabCase(property)}`,
                        value,
                    } as Extract<Declaration, { property: `transition${string}` | 'transition' }>,
                    builder,
                )
            }
            break
        }
        case 'transition-property': {
            builder.addDescriptor(
                declaration.property,
                declaration.value.map(v => v.property),
            )
            return
        }
        case 'transition-duration':
        case 'transition-delay':
            builder.addDescriptor(declaration.property, declaration.value.map(parseTime))
            return
        case 'transition-timing-function':
            builder.addDescriptor(declaration.property, parseEasingFunction(declaration.value))
            return
    }
}

export function addAnimationValue(
    declaration: Extract<Declaration, { property: `animation-${string}` | 'animation' }>,
    builder: StyleSheetBuilder,
) {
    switch (declaration.property) {
        case 'animation': {
            const grouped = {} as { [Key in keyof CssAnimation]: ValueOf<CssAnimation>[] }

            for (const animation of declaration.value) {
                for (const [key, value] of getEntries(animation)) {
                    grouped[key] ??= []
                    grouped[key].push(value)
                }
            }

            for (const [property, value] of getEntries(grouped)) {
                addAnimationValue(
                    {
                        property: `animation-${kebabCase(property)}`,
                        value,
                    } as Extract<Declaration, { property: `animation-${string}` | 'animation' }>,
                    builder,
                )
            }
            break
        }
        case 'animation-delay': {
            builder.addDescriptor(declaration.property, declaration.value.map(parseTime))
            break
        }
        case 'animation-direction': {
            builder.addDescriptor(declaration.property, declaration.value)
            break
        }
        case 'animation-duration': {
            builder.addDescriptor(declaration.property, declaration.value.map(parseTime))
            break
        }
        case 'animation-fill-mode': {
            builder.addDescriptor(declaration.property, declaration.value)
            break
        }
        case 'animation-iteration-count': {
            builder.addDescriptor(declaration.property, parseIterationCount(declaration.value))
            break
        }
        case 'animation-name': {
            builder.addDescriptor(
                declaration.property,
                declaration.value.map(v =>
                    v.type === 'none' ?
                        'none'
                    :   ([{}, 'animationName', [v.value], 1] as StyleDescriptor),
                ),
            )
            break
        }
        case 'animation-play-state': {
            builder.addDescriptor(declaration.property, declaration.value)
            break
        }
        case 'animation-timing-function': {
            builder.addDescriptor(declaration.property, parseEasingFunction(declaration.value))
            break
        }
    }
}

function parseBackgroundImage(
    declaration: DeclarationToken<'background-image'>,
    builder: StyleSheetBuilder,
) {
    builder.addDescriptor(
        'experimental_backgroundImage',
        declaration.value.flatMap((image): StyleDescriptor[] => {
            switch (image.type) {
                case 'gradient': {
                    const gradient = parseGradient(image.value, builder)
                    return gradient ? [gradient] : []
                }
                case 'none':
                    return ['none']
            }

            return []
        }),
    )
    return
}

function parseGradient(gradient: Gradient, builder: StyleSheetBuilder): StyleDescriptor {
    switch (gradient.type) {
        case 'linear': {
            return [
                {},
                '@linear-gradient',
                [
                    parseLineDirection(gradient.direction, builder),
                    ...gradient.items.map(item => parseGradientItem(item, builder)),
                ],
            ]
        }
    }

    return
}

function parseLineDirection(
    lineDirection: LineDirection,
    builder: StyleSheetBuilder,
): StyleDescriptor {
    switch (lineDirection.type) {
        case 'corner':
            return `to ${lineDirection.horizontal} ${lineDirection.vertical}`
        case 'horizontal':
        case 'vertical':
            return `to ${lineDirection.value}`
        case 'angle':
            return parseAngle(lineDirection.value, builder)
        default: {
            lineDirection satisfies never
        }
    }

    return
}

function parseGradientItem(
    item: GradientItemFor_DimensionPercentageFor_LengthValue,
    builder: StyleSheetBuilder,
): StyleDescriptor {
    switch (item.type) {
        case 'color-stop': {
            const args: StyleDescriptor[] = [parseColor(item.color, builder)]
            if (item.position) {
                args.push(parseLength(item.position, builder))
            }

            return [{}, '@colorStop', args, 1]
        }
        case 'hint':
            return parseLength(item.value, builder)
    }
}

export const cssColorNames = Object.freeze(
    new Set([
        'aliceblue',
        'antiquewhite',
        'aqua',
        'aquamarine',
        'azure',
        'beige',
        'bisque',
        'black',
        'blanchedalmond',
        'blue',
        'blueviolet',
        'brown',
        'burlywood',
        'cadetblue',
        'chartreuse',
        'chocolate',
        'coral',
        'cornflowerblue',
        'cornsilk',
        'crimson',
        'cyan',
        'darkblue',
        'darkcyan',
        'darkgoldenrod',
        'darkgray',
        'darkgreen',
        'darkgrey',
        'darkkhaki',
        'darkmagenta',
        'darkolivegreen',
        'darkorange',
        'darkorchid',
        'darkred',
        'darksalmon',
        'darkseagreen',
        'darkslateblue',
        'darkslategrey',
        'darkturquoise',
        'darkviolet',
        'deeppink',
        'deepskyblue',
        'dimgray',
        'dimgrey',
        'dodgerblue',
        'firebrick',
        'floralwhite',
        'forestgreen',
        'fuchsia',
        'gainsboro',
        'ghostwhite',
        'gold',
        'goldenrod',
        'gray',
        'green',
        'greenyellow',
        'grey',
        'honeydew',
        'hotpink',
        'indianred',
        'indigo',
        'ivory',
        'khaki',
        'lavender',
        'lavenderblush',
        'lawngreen',
        'lemonchiffon',
        'lightblue',
        'lightcoral',
        'lightcyan',
        'lightgoldenrodyellow',
        'lightgray',
        'lightgreen',
        'lightgrey',
        'lightpink',
        'lightsalmon',
        'lightseagreen',
        'lightskyblue',
        'lightslategrey',
        'lightsteelblue',
        'lightyellow',
        'lime',
        'limegreen',
        'linen',
        'magenta',
        'maroon',
        'mediumaquamarine',
        'mediumblue',
        'mediumorchid',
        'mediumpurple',
        'mediumseagreen',
        'mediumslateblue',
        'mediumspringgreen',
        'mediumturquoise',
        'mediumvioletred',
        'midnightblue',
        'mintcream',
        'mistyrose',
        'moccasin',
        'navajowhite',
        'navy',
        'oldlace',
        'olive',
        'olivedrab',
        'orange',
        'orangered',
        'orchid',
        'palegoldenrod',
        'palegreen',
        'paleturquoise',
        'palevioletred',
        'papayawhip',
        'peachpuff',
        'peru',
        'pink',
        'plum',
        'powderblue',
        'purple',
        'rebeccapurple',
        'red',
        'rosybrown',
        'royalblue',
        'saddlebrown',
        'salmon',
        'sandybrown',
        'seagreen',
        'seashell',
        'sienna',
        'silver',
        'skyblue',
        'slateblue',
        'slategray',
        'snow',
        'springgreen',
        'steelblue',
        'tan',
        'teal',
        'thistle',
        'tomato',
        'turquoise',
        'violet',
        'wheat',
        'white',
        'whitesmoke',
        'yellow',
        'yellowgreen',
    ]),
)
