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
