import { StyleSheet, ViewStyle } from 'react-native'

type FlexCenter = Required<
    Pick<ViewStyle, 'display' | 'flexDirection' | 'justifyContent' | 'alignItems'>
>
export const flexCenter: FlexCenter = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
}

export const absoluteFill = StyleSheet.absoluteFillObject
