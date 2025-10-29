import '@shopify/flash-list/jestSetup'

import type { ReactElement } from 'react'
import React from 'react'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import type { RenderOptions } from '@testing-library/react-native'
import { render, userEvent } from '@testing-library/react-native'

const createAppWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
        <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
    )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
    const Wrapper = createAppWrapper() // make sure we have a new wrapper for each render
    return render(ui, { wrapper: Wrapper, ...options })
}

// use this if you want to test user events
export const setup = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
    const Wrapper = createAppWrapper()
    return {
        user: userEvent.setup(),
        ...render(ui, { wrapper: Wrapper, ...options }),
    }
}

export * from '@testing-library/react-native'
export { customRender as render }
