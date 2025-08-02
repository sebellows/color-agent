import { Declaration } from 'lightningcss'

import { isStyleDescriptorArray } from '../../runtime/utils'
import { toRNProperty } from '../selectors'
import { StyleSheetBuilder } from '../stylesheet'
import {
    allowAutoProperties,
    CSSStyleProperty,
    properties,
    propertyRenameMap,
    runtimeProperties,
    validCssStyleProperties,
} from '@core/lib/react-native-css/common/properties'

export function parseDeclarationUnparsed(
    declaration: Extract<Declaration, { property: 'unparsed' }>,
    builder: StyleSheetBuilder,
) {
    let property = declaration.value.propertyId.property

    if (!(property in properties)) {
        builder.addWarning('property', property)
        return
    }

    /** React Native doesn't support all the logical properties */
    if (property in propertyRenameMap) {
        property = propertyRenameMap[property]
    }

    /** Unparsed shorthand properties need to be parsed at runtime */
    if (runtimeProperties.has(property)) {
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
    const property = declaration.value.name as CSSStyleProperty
    if (
        validCssStyleProperties.has(property) ||
        property.startsWith('--') ||
        property.startsWith('-rn-')
    ) {
        builder.addDescriptor(
            property,
            parseUnparsed(declaration.value.value, builder, allowAutoProperties.has(property)),
        )
    } else {
        builder.addWarning('property', declaration.value.name)
    }
}
