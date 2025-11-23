import React from 'react'

import { Stack, StackProps } from '../layout/stack'
import * as LabelPrimitive from '../primitives/label'
import { uiStyles } from './styles'
import { WithThemeStyleProps } from './util.types'

type LabelProps = React.ComponentPropsWithRef<typeof LabelPrimitive.Text>

const { label } = uiStyles

const Label = ({
    ref,
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
    style,
    ...props
}: WithThemeStyleProps<LabelPrimitive.TextProps>) => (
    <LabelPrimitive.Root
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={label.wrapper}
    >
        <LabelPrimitive.Text ref={ref} style={[label.main(props), style]} {...props} />
    </LabelPrimitive.Root>
)

Label.displayName = 'Label.Native'

type LabelGroupProps = LabelProps & { prefix?: React.ReactNode; suffix?: React.ReactNode } & Pick<
        StackProps,
        'spacing' | 'align'
    >

const LabelGroup = ({
    ref,
    prefix,
    suffix,
    spacing = 'xs',
    align = 'center',
    style,
    ...props
}: LabelGroupProps) => {
    const stackProps = { axis: 'x', spacing, align } as StackProps

    return (
        <Stack {...stackProps}>
            {prefix}
            <Label {...props} />
            {suffix}
        </Stack>
    )
}

export { Label, LabelGroup, type LabelProps, type LabelGroupProps }
