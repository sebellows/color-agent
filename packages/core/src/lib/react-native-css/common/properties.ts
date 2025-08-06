import { FilterFunction, FlexStyle } from 'react-native'

import { Prefix } from 'lightningcss'
import { ArraySlice, KeysOfUnion, LiteralUnion } from 'type-fest'

function arraySlice<
    TList extends readonly unknown[],
    Start extends number = 0,
    End extends number = TList['length'],
>(list: TList, start?: Start, end?: End) {
    return list.slice(start, end) as ArraySlice<TList, Start, End>
}

/**************************************************
 *
 * PROPERTY VALUE TEMPLATES
 *
 **************************************************/

export const dimensionValues = ['auto', '{number}', '{number}%'] as const

/**************************************************
 * CSS Properties
 *
 * List of CSS properties that can be used
 * (or adapted to be used) in React Native.
 **************************************************/
export const properties = [
    'align-content',
    'align-items',
    'align-self',
    'animation-delay',
    'animation-direction',
    'animation-duration',
    'animation-fill-mode',
    'animation-iteration-count',
    'animation-name',
    'animation-play-state',
    'animation-timing-function',
    'animation',
    'aspect-ratio',
    'background-color',
    'background-image',
    'block-size',
    'border-block-color',
    'border-block-end-color',
    'border-block-end-width',
    'border-block-end',
    'border-block-start-color',
    'border-block-start-width',
    'border-block-start',
    'border-block-width',
    'border-block',
    'border-bottom-color',
    'border-bottom-left-radius',
    'border-bottom-right-radius',
    'border-bottom-width',
    'border-bottom',
    'border-color',
    'border-end-end-radius',
    'border-end-start-radius',
    'border-inline-color',
    'border-inline-end-color',
    'border-inline-end-width',
    'border-inline-end',
    'border-inline-start-color',
    'border-inline-start-width',
    'border-inline-start',
    'border-inline-width',
    'border-inline',
    'border-left-color',
    'border-left-width',
    'border-left',
    'border-radius',
    'border-right-color',
    'border-right-width',
    'border-right',
    'border-start-end-radius',
    'border-start-start-radius',
    'border-style',
    'border-top-color',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-top-width',
    'border-top',
    'border-width',
    'border',
    'bottom',
    'box-shadow',
    'caret-color',
    'color',
    'column-gap',
    'container-name',
    'container-type',
    'container',
    'display',
    'fill',

    'filter',

    'flex-basis',
    'flex-direction',
    'flex-flow',
    'flex-grow',
    'flex-shrink',
    'flex-wrap',
    'flex',
    'font-family',
    'font-size',
    'font-style',
    'font-variant-caps',
    'font-weight',
    'font',
    'gap',
    'height',
    'inline-size',

    // Equivalent to `top`, `bottom`, `right` and `left`
    'inset',
    'inset-block',
    'inset-block-end',
    'inset-block-start',
    'inset-inline',
    'inset-inline-end',
    'inset-inline-start',

    'justify-content',
    'left',
    'letter-spacing',
    'line-height',
    'margin-block-end',
    'margin-block-start',
    'margin-block',
    'margin-bottom',
    'margin-inline-end',
    'margin-inline-start',
    'margin-inline',
    'margin-left',
    'margin-right',
    'margin-top',
    'margin',
    'max-block-size',
    'max-height',
    'max-inline-size',
    'max-width',
    'min-block-size',
    'min-height',
    'min-inline-size',
    'min-width',
    'opacity',
    'overflow',
    'padding-block-end',
    'padding-block-start',
    'padding-block',
    'padding-bottom',
    'padding-inline-end',
    'padding-inline-start',
    'padding-inline',
    'padding-left',
    'padding-right',
    'padding-top',
    'padding',
    'position',
    'right',
    'rotate',
    'row-gap',
    'scale',
    'stroke-width',
    'stroke',
    'text-align',
    'text-decoration-color',
    'text-decoration-line',
    'text-decoration-style',
    'text-decoration',
    'text-shadow',
    'text-transform',
    'top',
    'transform',
    'transition-delay',
    'transition-duration',
    'transition-property',
    'transition-timing-function',
    'transition',
    'translate',
    'user-select',
    'vertical-align',
    'width',
    'z-index',
] as const

export type CSSStyleProperty = (typeof properties)[number]
export const validCssStyleProperties = new Set(properties)

/**************************************************
 * Transform Properties
 **************************************************/

const transformKeysList = [
    'matrix',
    'perspective',
    'rotate',
    'rotateX',
    'rotateY',
    'rotateZ',
    'scale',
    'scaleX',
    'scaleY',
    'skewX',
    'skewY',
    'transformOrigin',
    'translateX',
    'translateY',
] as const

export type TransformKey = (typeof transformKeysList)[number]
export const transformKeys = new Set<TransformKey | string>(transformKeysList)

/**************************************************
 * Computed Runtime Properties
 **************************************************/

export const runtimeProperties = new Set([
    'animation',
    'text-shadow',
    'transform',
    'box-shadow',
    'border',
])

/**
 * Properties where the keyword "auto" is a valid value.
 */
const autoAllowedPropertiesList = [
    'align-self',
    'isolation', // Only available in the New Architecture (`auto` is default)
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'margin-start',
    'margin-end',
    'pointer-events',
    'text-align', // default
    'text-align-vertical', // default
    'user-select',
    'vertical-align', // default (Android only)
    'writing-direction', // default (iOS only)
] as const
export type AutoAllowedProperty = (typeof autoAllowedPropertiesList)[number]
export const autoAllowedProperties = new Set<AutoAllowedProperty>(autoAllowedPropertiesList)

/**
 * Properties that are renamed in the runtime.
 * This is used to map CSS properties to their runtime equivalents.
 */
export const propertyRenameMap: Record<string, string> = {
    'background-image': 'experimental_backgroundImage',
}

/**************************************************
 *
 * CSS Properties w/ Enum Values
 *
 **************************************************/

/**************************************************
 * Media Feature Segments
 **************************************************/
const mediaFeatureComparisonList = [
    'equal',
    'greater-than',
    'greater-than-equal',
    'less-than',
    'less-than-equal',
] as const
export type MediaFeatureComparison = (typeof mediaFeatureComparisonList)[number]
export const mediaFeatureComparisons = new Set(mediaFeatureComparisonList)

const mediaOperatorsList = ['and', 'or'] as const
export type MediaOperator = (typeof mediaOperatorsList)[number]
export const mediaOperators = new Set(mediaOperatorsList)

const mediaQualifierList = ['only', 'not'] as const
export type MediaQualifier = (typeof mediaQualifierList)[number]
export const mediaQualifiers = new Set(mediaQualifierList)

/** A media query feature identifier. */
const mediaFeatureIdentValuesList = [
    'width',
    'height',
    'aspect-ratio',
    'orientation',
    'overflow-block',
    'overflow-inline',
    'horizontal-viewport-segments',
    'vertical-viewport-segments',
    'display-mode',
    'resolution',
    'scan',
    'grid',
    'update',
    'environment-blending',
    'color',
    'color-index',
    'monochrome',
    'color-gamut',
    'dynamic-range',
    'inverted-colors',
    'pointer',
    'hover',
    'any-pointer',
    'any-hover',
    'nav-controls',
    'video-color-gamut',
    'video-dynamic-range',
    'scripting',
    'prefers-reduced-motion',
    'prefers-reduced-transparency',
    'prefers-contrast',
    'forced-colors',
    'prefers-color-scheme',
    'prefers-reduced-data',
    'device-width',
    'device-height',
    'device-aspect-ratio',
    '-webkit-device-pixel-ratio',
    '-moz-device-pixel-ratio',
] as const
export type MediaFeatureIdentValue = (typeof mediaFeatureIdentValuesList)[number]
export const mediaFeatureIdentValues = new Set(mediaFeatureIdentValuesList)

/**************************************************
 *
 * MISCELLANEOUS PROPERTIES - units, values, etc.
 *
 **************************************************/

const vendorPrefixList = ['webkit', 'moz', 'ms', 'o', 'none'] as const
export const vendorPrefixes = new Set<Prefix>(vendorPrefixList)

// Properties conforming to lightningcss' `Size` token type
// See node_modules/lightningcss/node/ast.d.ts
const sizeList = [
    'auto',
    'contain',
    'fill',
    'fit-content',
    'fit-content-function',
    'length-percentage',
    'max-content',
    'min-content',
    'stretch',
] as const
export const sizes = new Set(sizeList)

// Properties conforming to lightningcss' `MaxSize` token type
// See node_modules/lightningcss/node/ast.d.ts
const maxSizeList = [
    'none',
    'contain',
    'fit-content',
    'fit-content-function',
    'length-percentage',
    'max-content',
    'min-content',
    'stretch',
] as const
export const maxSizes = new Set(maxSizeList)

/** UNITS - used for properties dealing with size/dimension */
const unitsList = [
    'px',
    'em',
    'rem',
    'vw',
    'vh',
    'in',
    'cm',
    'mm',
    'q',
    'pt',
    'pc',
    'ex',
    'rex',
    'ch',
    'rch',
    'cap',
    'rcap',
    'ic',
    'ric',
    'lh',
    'rlh',
    'lvw',
    'svw',
    'dvw',
    'cqw',
    'lvh',
    'svh',
    'dvh',
    'cqh',
    'vi',
    'svi',
    'lvi',
    'dvi',
    'cqi',
    'vb',
    'svb',
    'lvb',
    'dvb',
    'cqb',
    'vmin',
    'svmin',
    'lvmin',
    'dvmin',
    'cqmin',
    'vmax',
    'svmax',
    'lvmax',
    'dvmax',
    'cqmax',
] as const
export const unitValues = new Set(unitsList)
const nativeUnits = arraySlice(unitsList, 0, 5)
type SupportedUnits = LiteralUnion<(typeof nativeUnits)[number], string>
export const supportedUnits = new Set<SupportedUnits>(nativeUnits)

/** ANGLE-UNITS - used in transforms */
const angleUnitsList = ['deg', 'rad', 'grad', 'turn'] as const
export const angleUnits = new Set(angleUnitsList)
export const supportedAngleUnits = angleUnits

/** TIME-UNITS - coming from AST */
const timeUnitsList = ['seconds', 'milliseconds'] as const
export const timeUnits = new Set(timeUnitsList)
export const supportedTimeUnits = timeUnits

/**
 * COLOR SPACES
 *
 * NOTE: We can support other color spaces, but we prefer these ones the most on the web.
 * Order of preference is: oklch, rgb, hex
 */
const colorSpacesList = [
    'hex',
    'rgb',
    'rgba',
    'hsl',
    'hsla',
    'hwb',
    'lab',
    'oklab',
    'lch',
    'oklch',
    'srgb',
    'display-p3',
    'a98-rgb',
    'prophoto-rgb',
    'rec2020',
    'xyz-d50',
    'xyz-d65',
    'light-dark',
] as const
export const colorSpaceValues = new Set<(typeof colorSpacesList)[number] | string>(colorSpacesList)
export const unsupportedColorSpaces = new Set(arraySlice(colorSpacesList, 5))
// NOTE: Native does not support oklch, so we opt for hsl(a), rgb(a), and hex (in that order).
export const supportedColorSpaces = new Set(arraySlice(colorSpacesList, 0, 5))

/**************************************************
 *
 * GRADIENT PROPERTIES
 *
 **************************************************/

const gradientTypeList = [
    'conic',
    'repeating-conic',
    'linear',
    'repeating-linear',
    'radial',
    'repeating-radial',
] as const
export const gradientDirections = new Set(gradientTypeList)

const gradientLineDirectionList = ['angle', 'horizontal', 'vertical'] as const
export const gradientLineDirections = new Set(gradientLineDirectionList)

const gradientHorizontalPositionList = ['left', 'right'] as const
export const gradientHorizontalPositions = new Set(gradientHorizontalPositionList)

const gradientVerticalPositionList = ['top', 'bottom'] as const
export const gradientVerticalPositions = new Set(gradientVerticalPositionList)

const radialGradientShapeList = ['circle', 'ellipse'] as const
export const radialGradientShapes = new Set(radialGradientShapeList)

const radialGradientShapeExtentList = [
    'closest-corner',
    'closest-side',
    'farthest-corner',
    'farthest-side',
] as const
export const radialGradientShapeExtents = new Set(radialGradientShapeExtentList)

/**************************************************
 *
 * BACKGROUND PROPERTIES
 *
 **************************************************/

const backgroundSizeKeywordList = ['contain', 'cover', 'auto'] as const
export const backgroundSizeValues = new Set(backgroundSizeKeywordList)
export const supportedBackgroundSizeValues = new Set([]) // Not supported in RN

const backgroundRepeatList = [
    'repeat',
    'repeat-x',
    'repeat-y',
    'no-repeat',
    'space',
    'round',
] as const
export const backgroundRepeatValues = new Set(backgroundRepeatList)
export const supportedBackgroundRepeatValues = new Set([]) // RN uses `resizeMode`

const backgroundAttachmentList = ['scroll', 'fixed', 'local'] as const
export const backgroundAttachmentValues = new Set(backgroundAttachmentList)
export const supportedBackgroundAttachmentValues = new Set([]) // Not supported in RN

const backgroundOriginList = ['padding-box', 'border-box', 'content-box'] as const
export const backgroundOriginValues = new Set(backgroundOriginList)
export const supportedBackgroundOriginValues = new Set([]) // Not supported in RN

const backgroundClipList = ['border', 'border-box', 'content-box', 'padding-box', 'text'] as const
export const backgroundClipValues = new Set(backgroundClipList)
export const supportedBackgroundClipValues = new Set([]) // Not supported in RN

/**************************************************
 *
 * LAYOUT PROPERTIES
 *
 **************************************************/

/** BOX-SIZING */
const boxSizingValuesList = ['content-box', 'border-box'] as const
export const boxSizingValues = new Set(boxSizingValuesList)
export const supportedBoxSizingValues = boxSizingValues

/**
 * DIRECTION
 *
 * ! iOS ONLY
 */
const directionValuesList = ['ltr', 'rtl', 'inherit'] as const
export const directionValues = new Set(directionValuesList)
export const supportedDirectionValues = directionValues

/** DISPLAY */
const displayValuesList = [
    'contents',
    'none',
    'flex',
    'inline-flex',
    'grid',
    'inline-grid',
    'block',
    'inline-block',
    'flow',
    'flow-root',
    'table',
    'inline-table',
    'ruby',
] as const
export const displayValues = new Set(arraySlice(displayValuesList, 1))
export const unsupportedDisplayValues = new Set(arraySlice(displayValuesList, 3))
export const supportedDisplayValues = new Set(arraySlice(displayValuesList, 0, 3))

/** ISOLATION */
const isolationValuesList = ['auto', 'isolate'] as const
export const isolationValues = new Set(isolationValuesList)

/** OBJECT-FIT */
const objectFitValuesList = ['fill', 'contain', 'cover', 'scale-down', 'none'] as const
export const objectFitValues = new Set(objectFitValuesList)
export const supportedObjectFitValues = objectFitValues

/** OVERFLOW */
const overflowValuesList = [
    'visible',
    'hidden',
    'scroll',
    'clip',
    'auto',
    'hidden visible',
] as const
export const overflowValues = new Set(overflowValuesList)
export const supportedOverflowValues = new Set(arraySlice(overflowValuesList, 0, 3))

/** POSITION */
const positionValuesList = ['absolute', 'relative', 'static', 'fixed', 'sticky'] as const
export const positionValues = new Set(positionValuesList)
export const supportedPositionValues = new Set(arraySlice(positionValuesList, 0, 3))

/** VISIBILITY */
const visibilityList = ['visible', 'hidden', 'collapse'] as const
export const visibilityValues = new Set(visibilityList)
export const supportedVisibilityValues = visibilityValues

/**************************************************
 *
 * FLEXBOX PROPERTIES
 *
 **************************************************/

/**
 * Flexbox Flex-Direction
 */
const flexDirectionValuesList = ['row', 'row-reverse', 'column', 'column-reverse'] as const
export const flexDirectionValues = new Set(flexDirectionValuesList)
export const supportedFlexDirectionValues = flexDirectionValues

/**
 * Flexbox Flex-Wrap
 */
const flexWrapValuesList = ['wrap', 'nowrap', 'wrap-reverse'] as const
export const flexWrapValues = new Set(flexWrapValuesList)
export const supportedFlexWrapValues = flexWrapValues

/**
 * Flexbox Justify-Content
 */
const justifyContentValuesList = [
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'space-evenly',
] as const
export const justifyContentValues = new Set(justifyContentValuesList)
export const supportedJustifyContentValues = justifyContentValues

/**
 * Flexbox Justify-Self
 *
 * NOTE: Not supported in RN
 */
const justifySelfValuesList = [
    'auto',
    'normal',
    'stretch',
    'center',
    'start',
    'end',
    'self-start',
    'self-end',
] as const
export const justifySelfValues = new Set(justifySelfValuesList)
export const supportedJustifySelfValues = new Set([]) // Not supported in RN

/**
 * Flexbox Align-Content
 * NOTE: Native does not support `first baseline`, `last baseline`, `safe center`,
 * `unsafe center`, `revert`, `revert-layer`, `unset`, `inherit`, or `initial`
 */
const alignContentValuesList = [
    'flex-start',
    'flex-end',
    'center',
    'stretch',
    'space-between',
    'space-around',
    'space-evenly',
] as const
export const alignContentValues = new Set(alignContentValuesList)
export const supportedAlignContentValues = alignContentValues

/**
 * Flexbox Align-Items
 */
const alignItemsValuesList = ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'] as const
export const alignItemsValues = new Set(alignItemsValuesList)
export const supportedAlignItemsValues = alignItemsValuesList

/**
 * Flexbox Align-Self
 */
const alignSelfValuesList = [
    'auto',
    'flex-start',
    'flex-end',
    'center',
    'baseline',
    'stretch',
] as const
export type AlignSelf = FlexStyle['alignSelf'] // (typeof alignSelfValuesList)[number]
export const alignSelfValues = new Set(alignSelfValuesList)
export const supportedAlignSelfValues = alignSelfValues

/**************************************************
 *
 * TYPOGRAPHY PROPERTIES
 *
 **************************************************/

/** FONT-FAMILY */
const fontFamilyKeywordsList = [
    'serif',
    'sans-serif',
    'cursive',
    'fantasy',
    'monospace',
    'system-ui',
    'emoji',
    'math',
    'fangsong',
    'ui-serif',
    'ui-sans-serif',
    'ui-monospace',
    'ui-rounded',
    'initial',
    'inherit',
    'unset',
    'default',
    'revert',
    'revert-layer',
] as const
export const fontFamilyKeywords = new Set(fontFamilyKeywordsList)
export const supportedFontFamilyKeywords = new Set([])

/** FONT-STYLE */
const fontStyleValuesList = ['oblique', 'normal', 'italic'] as const
export const fontStyleValues = new Set(fontStyleValuesList)
export const supportedFontStyleValues = new Set(arraySlice(fontStyleValuesList, 1))

/** FONT-VARIANTS */
const fontVariantValues__webOnly = [
    /** keyword values */
    'normal',
    'none',

    /** font-variant-caps */
    'all-small-caps',
    'petite-caps',
    'all-petite-caps',
    'titling-caps',
    'unicase',

    /** font-variant-numeric */
    'diagonal-fractions',
    'stacked-fractions',
    'ordinal',
    'slashed-zero',
] as const
const fontVariantValues__rnOnly = [
    /** Stylistic font-ligatures like the following only exist in RN */
    'stylistic-one',
    'stylistic-two',
    'stylistic-three',
    'stylistic-four',
    'stylistic-five',
    'stylistic-six',
    'stylistic-seven',
    'stylistic-eight',
    'stylistic-nine',
    'stylistic-ten',
    'stylistic-eleven',
    'stylistic-twelve',
    'stylistic-thirteen',
    'stylistic-fourteen',
    'stylistic-fifteen',
    'stylistic-sixteen',
    'stylistic-seventeen',
    'stylistic-eighteen',
    'stylistic-nineteen',
    'stylistic-twenty',
] as const
const fontVariantValuesShared = [
    /** font-variant-caps -- RN SUPPORTS ONLY ONE */
    'small-caps',

    /** font-variant-numeric -- RN SUPPORTS HALF */
    'oldstyle-nums',
    'lining-nums',
    'proportional-nums',
    'tabular-nums',

    /** font-variant-ligatures -- RN SUPPORTS ALL */
    'common-ligatures',
    'no-common-ligatures',
    'discretionary-ligatures',
    'no-discretionary-ligatures',
    'historical-ligatures',
    'no-historical-ligatures',
    'contextual',
    'no-contextual',
] as const
export const fontVariantValues = new Set(
    [fontVariantValuesShared, fontVariantValues__webOnly].flat(),
)
export const supportedFontVariantValues = new Set(
    [fontVariantValuesShared, fontVariantValues__rnOnly].flat(),
)

/** FONT-WEIGHT */
const fontWeightsList = ['normal', 'bold', 100, 200, 300, 400, 500, 600, 700, 800, 900] as const
const fontWeightKeywords__web = ['bolder', 'lighter'] as const
const fontWeightsList__rn = [
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    'ultralight',
    'thin',
    'light',
    'medium',
    'regular',
    'semibold',
    'condensedBold',
    'condensed',
    'heavy',
    'black',
] as const
export const fontWeightValues = new Set([fontWeightsList, fontWeightKeywords__web].flat())
export const supportedFontWeightValues = new Set([fontWeightsList, fontWeightsList__rn].flat())

/**
 * FONT-STRETCH
 *
 * ! NOT SUPPORTED IN REACT-NATIVE
 */
const fontStretchKeywordsList = [
    'normal',
    'ultra-condensed',
    'extra-condensed',
    'condensed',
    'semi-condensed',
    'semi-expanded',
    'expanded',
    'extra-expanded',
    'ultra-expanded',
] as const
export const fontStretchKeywords = new Set(fontStretchKeywordsList)
export const supportedFontStretchKeywords = new Set([]) // Not supported in RN

/** LINE-HEIGHT */
const lineHeightKeywordsList = ['normal'] as const
export const lineHeightKeywords = new Set(lineHeightKeywordsList)
export const supportedLineHeightKeywords = new Set([]) // Not supported in RN

const textAlignValuesList = ['auto', 'left', 'right', 'center', 'justify'] as const
export const textAlignValues = new Set(textAlignValuesList)
export const supportedTextAlignValues = textAlignValues

/**
 * VISIBILITY
 *
 * ! iOS ONLY
 */
const textAlignVerticalValuesList = ['auto', 'top', 'bottom', 'center'] as const
export const textAlignVerticalValues = new Set(textAlignVerticalValuesList)
export const supportedTextAlignVerticalValues = textAlignVerticalValues

/** TEXT-DECORATION */
const textDecorationLineValuesList = [
    'underline line-through',
    'none',
    'underline',
    'line-through',
    'overline',
    'spelling-error',
    'grammar-error',
] as const
export const textDecorationLineValues = new Set(arraySlice(textDecorationLineValuesList, 1))
export const supportedTextDecorationLineValues = new Set(
    arraySlice(textDecorationLineValuesList, 0, 4),
)

/**
 * TEXT-DECORATION
 *
 * ! iOS ONLY
 */
const textDecorationStyleValuesList = ['solid', 'double', 'dotted', 'dashed', 'wavy'] as const
export const textDecorationStyleValues = new Set(textDecorationStyleValuesList)
export const supportedTextDecorationStyleValues = new Set(
    arraySlice(textDecorationStyleValuesList, 0, 4),
)

/** TEXT-TRANSFORM */
const textTransformValuesList = [
    'none',
    'uppercase',
    'lowercase',
    'capitalize',
    // All below are web-only
    'full-width',
    'full-size-kana',
    'math-auto',
] as const
export const textTransformValues = new Set(textTransformValuesList)
export const supportedTextTransformValues = new Set(arraySlice(textTransformValuesList, 0, 4))

/** USER-SELECT */
const userSelectValuesList = ['contain', 'auto', 'none', 'text', 'all'] as const
export const userSelectValues = new Set(arraySlice(userSelectValuesList, 1)) // `contain` is RN ONLY!
export const supportedUserSelectValues = new Set(userSelectValuesList)

/** VERTICAL-ALIGN */
const verticalAlignValuesList = [
    'auto', // not part of web spec
    'top',
    'middle',
    'bottom',
    'baseline',
    'sub',
    'super',
    'text-top',
    'text-bottom',
] as const
export const verticalAlignValues = new Set(arraySlice(verticalAlignValuesList, 1))
export const supportedVerticalAlignValues = new Set(arraySlice(verticalAlignValuesList, 0, 4))

/**
 * WRITING-DIRECTION
 *
 * ! REACT-NATIVE ONLY
 * The closest equivalent for `writingDirection` in CSS is the `direction` property,
 * which is discouraged in favor of using the `dir` HTML attribute instead.
 */
const writingDirectionValuesList = ['auto', 'ltr', 'rtl'] as const
export const writingDirectionValues = new Set(arraySlice(writingDirectionValuesList, 1))
export const supportedWritingDirectionValues = new Set(writingDirectionValuesList)

/**************************************************
 *
 * FILTERS
 *
 **************************************************/

export type FilterFunctions = KeysOfUnion<FilterFunction>

const filterValuesList = [
    'blur', // number | string
    'brightness', // number | string
    'contrast', // number | string

    /**
     * @type DropShadowValue
     * @property offsetX: number | string;
     * @property offsetY: number | string;
     * @property standardDeviation?: number | string | undefined;
     * @property color?: ColorValue | number | undefined;
     */
    'drop-shadow',
    'grayscale', // number | string
    'hue-rotate', // number | string
    'invert', // number | string
    'saturate', // number | string
    'sepia', // number | string
] as const
export const filterValues = new Set(filterValuesList)
export const supportedFilterValues = filterValues

// `mixBlendMode` (ViewStyle)
const blendModeValuesList = [
    'normal',
    'multiply',
    'screen',
    'overlay',
    'darken',
    'lighten',
    'color-dodge',
    'color-burn',
    'hard-light',
    'soft-light',
    'difference',
    'exclusion',
    'hue',
    'saturation',
    'color',
    'luminosity',
] as const
export const blendModeValues = new Set(blendModeValuesList)
export const supportedBlendModeValues = blendModeValues

/**************************************************
 *
 * View Style Properties
 *
 **************************************************/

/**
 * BACKFACE-VISIBILITY
 *
 * NOTE: Also applies to ImageStyle
 */
const backfaceVisibilityValuesList = ['visible', 'hidden'] as const
export const backfaceVisibilityValues = new Set(backfaceVisibilityValuesList)
export const supportedBackfaceVisibilityValues = backfaceVisibilityValues

/** BORDER-STYLE */
const borderStyleValuesList = [
    'dotted',
    'dashed',
    'solid',
    'none',
    'hidden',
    'inset',
    'groove',
    'outset',
    'ridge',
    'double',
] as const
export const borderStyleValues = new Set(borderStyleValuesList)
export const supportedBorderStyleValues = new Set(arraySlice(borderStyleValuesList, 0, 3))

/** BORDER-WIDTH */
const borderWidthValuesList = ['thin', 'medium', 'thick'] as const
export const borderWidthValues = new Set(borderWidthValuesList)
export const supportedBorderWidthValues = new Set([]) // Not supported in RN

/** CURSOR TYPE */
const cursorValuesList = [
    'auto',
    'pointer',
    // Everything below is web-only
    'default',
    'context-menu',
    'help',
    'pointer',
    'progress',
    'wait',
    'cell',
    'crosshair',
    'text',
    'vertical-text',
    'alias',
    'copy',
    'move',
    'no-drop',
    'not-allowed',
    'grab',
    'grabbing',
    'all-scroll',
    'col-resize',
    'row-resize',
    'n-resize',
    'e-resize',
    's-resize',
    'w-resize',
    'ne-resize',
    'nw-resize',
    'se-resize',
    'sw-resize',
    'ns-resize',
    'nesw-resize',
    'nwse-resize',
    'zoom-in',
    'zoom-out',
] as const
export const cursorValues = new Set(cursorValuesList)
export const supportedCursorValues = new Set(arraySlice(cursorValuesList, 0, 2))

/** OUTLINE-STYLE */
const outlineStyleValuesList = [
    'solid',
    'dotted',
    'dashed',
    'auto',
    'none',
    'double',
    'groove',
    'ridge',
    'inset',
    'outset',
] as const
export const outlineStyleValues = new Set(outlineStyleValuesList)
export const supportedOutlineStyleValues = new Set(arraySlice(outlineStyleValuesList, 0, 3))

/** POINTER-EVENTS */
const pointerEventsValuesList = [
    // RN-specific value
    'box-none',
    'box-only',

    // Keyword values
    'auto',
    'none',

    // SVG-related values
    'bounding-box',
    'all',
    'fill',
    'stroke',
    'painted',
    'visible',
    'visiblePainted',
    'visibleFill',
    'visibleStroke',
] as const
export const pointerEventsValues = new Set(arraySlice(pointerEventsValuesList, 2))
export const supportedPointerEventsValues = new Set(arraySlice(pointerEventsValuesList, 0, 4))

/**************************************************
 *
 * Image Style Properties
 *
 **************************************************/

/**
 * RESIZE-MODEL
 *
 * ! REACT-NATIVE ONLY
 *
 * NOTE: This is the RN equivalent to both `background-repeat` and `background-size`.
 */
const resizeModeValuesList = [
    'repeat',
    'cover',
    'contain',
    'stretch',
    'center',
    'no-repeat',
] as const
export const resizeModeValues = new Set([]) // Not supported in CSS
export const supportedResizeModeValues = new Set(resizeModeValuesList)

/**************************************************
 *
 * Animation Style Properties
 *
 **************************************************/

const animationProps = {
    //
}

/** ANIMATION-/TRANSITION-TIMING-FUNCTION */
const timingFunctionValuesList = [
    'linear',
    'ease',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'cubic-bezier',
    'steps',
    'step-start',
    'step-end',
] as const
export const timingFunctionValues = new Set(timingFunctionValuesList)
export const supportedTimingFunctionValues = new Set(arraySlice(timingFunctionValuesList, 0, -2))
