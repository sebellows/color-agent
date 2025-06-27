import React from 'react'
import { ButtonProps } from './use-button-props'

type PropsWithRef<Props = unknown> = Props & {
    ref?: React.Ref<any>
}

const Button = ({ as: asProp, disabled, ref, ...props }: ButtonProps) => {
    const [buttonProps, { tagName: Component }] = useButtonProps({
        tagName: asProp,
        disabled,
        ...props,
    })

    return <Component {...props} {...buttonProps} ref={ref} />
}

Button.displayName = 'Button'

export default Button
