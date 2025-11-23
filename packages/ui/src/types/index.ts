export * from './a11y'
export * from './react-native.types'
export * from './style-sheet.types'

export const ReduceMotion = {
    System: 'system',
    Always: 'always',
    Never: 'never',
} as const

declare namespace ReduceMotion {
    type System = (typeof ReduceMotion)['System']
    type Always = (typeof ReduceMotion)['Always']
    type Never = (typeof ReduceMotion)['Never']
}

export type ReduceMotion = (typeof ReduceMotion)[keyof typeof ReduceMotion]
