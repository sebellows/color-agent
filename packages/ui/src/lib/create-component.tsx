import { AnyRecord } from '@coloragent/utils'

import { isWeb } from '../utils/common'

type ComponentConfig<
    Name extends string = string,
    Tag extends React.ElementType = React.ElementType,
> = {
    name?: Name
    tag?: Tag
}

export const createComponent = <
    Props extends AnyRecord = AnyRecord,
    Config extends ComponentConfig = ComponentConfig,
>(
    BaseComponent: React.ComponentType<any>,
    config?: Config,
    initialProps?: Props & React.ComponentProps<typeof BaseComponent>,
) => {
    const Component = (props: Props) => {
        const mergedProps = { ...initialProps, ...props }
        if (isWeb && config?.tag) {
            const Tag = config.tag as keyof React.JSX.IntrinsicElements
            return <BaseComponent as={Tag} {...mergedProps} />
        }
        return <BaseComponent {...mergedProps} />
    }
    if (config?.name) {
        Component.displayName = config.name
    }
    type ComponentType = typeof Component
    return Component as ComponentType
}
