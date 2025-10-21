import React from 'react'

import { FocusScopeProps } from './focus-scope.types'

/**************************************************
 * @constant FocusScope
 * @src Tamagui
 **************************************************/

export const FocusScope = React.forwardRef((props: FocusScopeProps, _ref) => {
    return props.children as any
})
