import { AnyRecord } from '@coloragent/utils'
import { Entries } from 'type-fest'

export function getEntries<T extends AnyRecord>(obj: T): Entries<T> {
    return Object.entries(obj) as Entries<T>
}
