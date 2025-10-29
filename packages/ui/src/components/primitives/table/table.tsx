import { Pressable, View } from 'react-native'

import type { SlottablePressableProps, SlottableViewProps } from '../../../types'
import { Slot } from '../slot'

type RootProps = SlottableViewProps

const Root = ({ ref, asChild, ...props }: RootProps) => {
    const Component = asChild ? Slot.View : View
    return <Component role="table" ref={ref} {...props} />
}

Root.displayName = 'TableRoot'

type HeaderProps = SlottableViewProps

const Header = ({ ref, asChild, ...props }: HeadProps) => {
    const Component = asChild ? Slot.View : View
    return <Component role="rowheader" ref={ref} {...props} />
}

Header.displayName = 'TableHeader'

type RowProps = SlottablePressableProps

const Row = ({ ref, asChild, ...props }: RootProps) => {
    const Component = asChild ? Slot.Pressable : Pressable
    return <Component ref={ref} role="row" {...props} />
}

Row.displayName = 'TableRow'

type HeadProps = SlottableViewProps

const Head = ({ ref, asChild, ...props }: HeadProps) => {
    const Component = asChild ? Slot.View : View
    return <Component ref={ref} role="columnheader" {...props} />
}

Head.displayName = 'TableHead'

type BodyProps = SlottableViewProps

const Body = ({ ref, asChild, ...props }: BodyProps) => {
    const Component = asChild ? Slot.View : View
    return <Component ref={ref} role="rowgroup" {...props} />
}
Body.displayName = 'TableBody'

type CellProps = SlottableViewProps

const Cell = ({ ref, asChild, ...props }: CellProps) => {
    const Component = asChild ? Slot.View : View
    return <Component ref={ref} role="cell" {...props} />
}

Cell.displayName = 'TableCell'

type FooterProps = SlottableViewProps

const Footer = ({ ref, asChild, ...props }: FooterProps) => {
    const Component = asChild ? Slot.View : View
    return <Component ref={ref} role="rowgroup" {...props} />
}

Footer.displayName = 'TableFooter'

export { Body, Cell, Footer, Head, Header, Root, Row }

export type { BodyProps, CellProps, FooterProps, HeaderProps, HeadProps, RootProps, RowProps }
