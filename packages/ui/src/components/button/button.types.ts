import { LinkHTMLAttributes } from 'react'

export type ButtonType = 'button' | 'reset' | 'submit'

export interface AnchorOptions {
    href?: string
    rel?: string
    target?: string
}

export function isTrivialHref(href?: string) {
    return !href || href.trim() === '#'
}

export interface AriaButtonProps {
    type?: ButtonType | undefined
    /**
     * Disables the Button, preventing mouse events,
     * even if the underlying component is an `<a>` element
     */
    disabled?: boolean | undefined

    /**
     * Providing a `href` will render an `<a>` element, _styled_ as a button.
     */
    href?: string | undefined

    role?: React.AriaRole
    tabIndex?: number | undefined
    target?: string | undefined
    rel?: string | undefined
    'aria-disabled'?: true | undefined
    onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void
    onKeyDown?: (event: React.KeyboardEvent) => void
}

export interface UseButtonPropsMetadata {
    tagName: React.ElementType
}
