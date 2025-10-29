import { Stack, StackProps } from '../layout/stack'
import * as LabelPrimitive from '../primitives/label'

type LabelProps = React.ComponentPropsWithRef<typeof LabelPrimitive.Text>

const Label = ({
    ref,
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
    ...props
}: React.ComponentPropsWithRef<typeof LabelPrimitive.Text>) => (
    <LabelPrimitive.Root
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
    >
        <LabelPrimitive.Text ref={ref} {...props} />
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
