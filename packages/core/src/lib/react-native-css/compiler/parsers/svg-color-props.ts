export function parseSVGPaint(
    { value }: DeclarationType<'fill' | 'stroke'>,
    builder: StyleSheetBuilder,
) {
    if (value.type === 'none') {
        return 'transparent'
    } else if (value.type === 'color') {
        return parseColor(value.value, builder)
    }

    return
}
