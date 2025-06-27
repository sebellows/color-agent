import * as React from 'react'

import { type AnchorOptions, type ButtonType, isTrivialHref } from './button.types'

export interface UseButtonPropsOptions extends AnchorOptions {
    type?: ButtonType
    disabled?: boolean
    onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>
    tabIndex?: number
    tagName?: keyof React.JSX.IntrinsicElements
    role?: React.AriaRole | undefined
}

export function useButtonProps({
    tagName,
    disabled,
    href,
    target,
    rel,
    role,
    onClick,
    tabIndex = 0,
    type,
}: UseButtonPropsOptions): [AriaButtonProps, UseButtonPropsMetadata] {
    if (!tagName) {
        if (href != null || target != null || rel != null) {
            tagName = 'a'
        } else {
            tagName = 'button'
        }
    }

    const meta: UseButtonPropsMetadata = { tagName }
    if (tagName === 'button') {
        return [{ type: (type as any) || 'button', disabled }, meta]
    }

    const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
        if (disabled || (tagName === 'a' && isTrivialHref(href))) {
            event.preventDefault()
        }

        if (disabled) {
            event.stopPropagation()
            return
        }

        onClick?.(event)
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === ' ') {
            event.preventDefault()
            handleClick(event)
        }
    }

    if (tagName === 'a') {
        // Ensure there's a href so Enter can trigger anchor button.
        href ||= '#'
        if (disabled) {
            href = undefined
        }
    }

    return [
        {
            role: role ?? 'button',
            // explicitly undefined so that it overrides the props disabled in a spread
            // e.g. <Tag {...props} {...hookProps} />
            disabled: undefined,
            tabIndex: disabled ? undefined : tabIndex,
            href,
            target: tagName === 'a' ? target : undefined,
            'aria-disabled': !disabled ? undefined : disabled,
            rel: tagName === 'a' ? rel : undefined,
            onClick: handleClick,
            onKeyDown: handleKeyDown,
        },
        meta,
    ]
}

export interface BaseButtonProps {
    /**
     * Control the underlying rendered element directly by passing in a valid
     * component type
     */
    as?: keyof React.JSX.IntrinsicElements | undefined

    /** The disabled state of the button */
    disabled?: boolean | undefined

    /** Optionally specify an href to render a `<a>` tag styled as a button */
    href?: string | undefined

    /** Anchor target, when rendering an anchor as a button */
    target?: string | undefined

    rel?: string | undefined
}

export interface ButtonProps extends BaseButtonProps, React.ComponentPropsWithoutRef<'button'> {}
