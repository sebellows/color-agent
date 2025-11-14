// import { StyleProp } from 'react-native'

import { AnyRecord } from '@coloragent/utils'
import { Get } from 'type-fest'

// import { Theme } from '../theme/theme'
// import { RNStyleProps } from './react-native.types'

type StyleSheetObj = Record<string, AnyRecord>

type VariantObj = {
    variants: {
        variant: {
            [variant: string]: AnyRecord
        }
        [variant: string]: AnyRecord
    }
    [variant: string]: AnyRecord
}

type VariantFn = (...args: any) => AnyRecord & Record<string, VariantObj>

type WithVariants<SS extends StyleSheetObj, K extends keyof SS> = SS[K] extends (
    infer StyleObj extends VariantObj
) ?
    Get<StyleObj, 'variants.variant'>
: SS[K] extends infer StyleFn extends VariantFn ? ReturnType<StyleFn>
: never

type VariantProp<SS extends StyleSheetObj, K extends keyof SS> = SS[K] extends (
    infer Variants extends WithVariants<SS, K>
) ?
    { variant: keyof Variants }
:   { variant?: string }

export type PropsWithVariant<Props, SS extends StyleSheetObj, K extends keyof SS> = Props &
    VariantProp<SS, K>

// export type StyleSheetCreateFn = (theme: Theme) => {
//     [key: PropertyKey]: ((props: AnyRecord) => StyleProp<RNStyleProps>) | StyleProp<RNStyleProps>
// }
