import { isPlainObject } from 'es-toolkit'

export const EMPTY_STYLE_OBJECT = {}

export type EmptyStyleObject = typeof EMPTY_STYLE_OBJECT

export function isEmptyStyle(obj: unknown): obj is EmptyStyleObject {
    return isPlainObject(obj) && Object.keys(obj).length === 0
}
