import * as React from 'react'

import { useEvent } from '../../hooks/use-event'
import { createContextScope } from '../../lib/create-context'
import type { FocusScopeProps, ScopedProps } from './focus-scope.types'

/**************************************************
 * FocusScopeController
 * @src Tamagui
 **************************************************/

const FOCUS_SCOPE_CONTROLLER_NAME = 'FocusScopeController'

const [createFocusScopeControllerContext, createFocusScopeControllerScope] = createContextScope(
    FOCUS_SCOPE_CONTROLLER_NAME,
)

type FocusScopeControllerContextValue = Omit<FocusScopeProps, 'children'>

const [FocusScopeControllerProvider, useFocusScopeControllerContext] =
    createFocusScopeControllerContext<FocusScopeControllerContextValue>(FOCUS_SCOPE_CONTROLLER_NAME)

export interface FocusScopeControllerProps extends FocusScopeControllerContextValue {
    children?: React.ReactNode
}

function FocusScopeController(props: ScopedProps<FocusScopeControllerProps>) {
    const {
        __scopeFocusScope,
        children,
        enabled,
        loop,
        trapped,
        onMountAutoFocus,
        onUnmountAutoFocus,
        forceUnmount,
        focusOnIdle,
    } = props

    const stableOnMountAutoFocus = useEvent(onMountAutoFocus)
    const stableOnUnmountAutoFocus = useEvent(onUnmountAutoFocus)

    const contextValue = React.useMemo(
        () => ({
            enabled,
            loop,
            trapped,
            onMountAutoFocus: stableOnMountAutoFocus,
            onUnmountAutoFocus: stableOnUnmountAutoFocus,
            forceUnmount,
            focusOnIdle,
        }),
        [
            enabled,
            loop,
            trapped,
            stableOnMountAutoFocus,
            stableOnUnmountAutoFocus,
            forceUnmount,
            focusOnIdle,
        ],
    )

    return (
        <FocusScopeControllerProvider scope={__scopeFocusScope} {...contextValue}>
            {children}
        </FocusScopeControllerProvider>
    )
}

const FocusScopeControllerComponent = FocusScopeController

export {
    createFocusScopeControllerScope,
    FocusScopeControllerComponent as FocusScopeController,
    FocusScopeControllerProvider,
    useFocusScopeControllerContext,
}
