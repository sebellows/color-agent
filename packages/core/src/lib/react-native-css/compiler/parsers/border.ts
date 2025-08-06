import { BorderSideWidth } from 'lightningcss'

import { StyleSheetBuilder } from '../stylesheet'

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

function parseBorderRadius(
    { value }: DeclarationType<'border-radius'>,
    builder: StyleSheetBuilder,
) {
    builder.addShorthand('border-radius', {
        'border-bottom-left-radius': parseSize2DDimensionPercentage(value.bottomLeft, builder),
        'border-bottom-right-radius': parseSize2DDimensionPercentage(value.bottomRight, builder),
        'border-top-left-radius': parseSize2DDimensionPercentage(value.topLeft, builder),
        'border-top-right-radius': parseSize2DDimensionPercentage(value.topRight, builder),
    })
}

function parseBorderColor({ value }: DeclarationType<'border-color'>, builder: StyleSheetBuilder) {
    builder.addShorthand('border-color', {
        'border-top-color': parseColor(value.top, builder),
        'border-bottom-color': parseColor(value.bottom, builder),
        'border-left-color': parseColor(value.left, builder),
        'border-right-color': parseColor(value.right, builder),
    })
}

function parseBorderWidth({ value }: DeclarationType<'border-width'>, builder: StyleSheetBuilder) {
    builder.addShorthand('border-width', {
        'border-top-width': parseBorderSideWidth(value.top, builder),
        'border-bottom-width': parseBorderSideWidth(value.bottom, builder),
        'border-left-width': parseBorderSideWidth(value.left, builder),
        'border-right-width': parseBorderSideWidth(value.right, builder),
    })
}

function parseBorder({ value }: DeclarationType<'border'>, builder: StyleSheetBuilder) {
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
    }: DeclarationType<'border-top' | 'border-bottom' | 'border-left' | 'border-right'>,
    builder: StyleSheetBuilder,
) {
    builder.addDescriptor(property + '-color', parseColor(value.color, builder))
    builder.addDescriptor(property + '-width', parseBorderSideWidth(value.width, builder))
}

function parseBorderBlock({ value }: DeclarationType<'border-block'>, builder: StyleSheetBuilder) {
    builder.addDescriptor('border-top-color', parseColor(value.color, builder))
    builder.addDescriptor('border-bottom-color', parseColor(value.color, builder))
    builder.addDescriptor('border-top-width', parseBorderSideWidth(value.width, builder))
    builder.addDescriptor('border-bottom-width', parseBorderSideWidth(value.width, builder))
}

function parseBorderBlockStart(
    { value }: DeclarationType<'border-block-start'>,
    builder: StyleSheetBuilder,
) {
    builder.addDescriptor('border-top-color', parseColor(value.color, builder))
    builder.addDescriptor('border-top-width', parseBorderSideWidth(value.width, builder))
}

function parseBorderBlockEnd(
    { value }: DeclarationType<'border-block-end'>,
    builder: StyleSheetBuilder,
) {
    builder.addDescriptor('border-bottom-color', parseColor(value.color, builder))
    builder.addDescriptor('border-bottom-width', parseBorderSideWidth(value.width, builder))
}

function parseBorderInline(
    { value }: DeclarationType<'border-inline'>,
    builder: StyleSheetBuilder,
) {
    builder.addDescriptor('border-left-color', parseColor(value.color, builder))
    builder.addDescriptor('border-right-color', parseColor(value.color, builder))
    builder.addDescriptor('border-left-width', parseBorderSideWidth(value.width, builder))
    builder.addDescriptor('border-right-width', parseBorderSideWidth(value.width, builder))
}

function parseBorderInlineStart(
    { value }: DeclarationType<'border-inline-start'>,
    builder: StyleSheetBuilder,
) {
    builder.addDescriptor('border-left-color', parseColor(value.color, builder))
    builder.addDescriptor('border-left-width', parseBorderSideWidth(value.width, builder))
}

function parseBorderInlineEnd(
    { value }: DeclarationType<'border-inline-end'>,
    builder: StyleSheetBuilder,
) {
    builder.addDescriptor('border-right-color', parseColor(value.color, builder))
    builder.addDescriptor('border-right-width', parseBorderSideWidth(value.width, builder))
}
