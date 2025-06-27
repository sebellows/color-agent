import {
    getType,
    is,
    isEmpty,
    isError,
    isMap,
    isNativeObject,
    isNonPrimitive,
    isPlainObject,
    isPrimitive,
    isUndefined,
    typeOf,
} from './lang'

describe('getType', () => {
    it("will extract the constructor type using the `toString` method on a value's prototype", () => {
        const result = getType({ foo: 'bar' })
        expect(result).toStrictEqual('Object')
    })

    it("will return 'Null' when the passed value is `null`", () => {
        expect(getType(null)).toStrictEqual('Null')
    })
})

describe('is', () => {
    it('verifies that a passed object in the 1st param matches the lowercase type passed as 2nd param', () => {
        const result = is({ foo: 'bar' }, 'object')
        expect(result).toStrictEqual(true)
    })

    it("will return `false` if the type does not match the passed object's type", () => {
        const result = is(['array', 'of', 'strings'], 'string')
        expect(result).toStrictEqual(false)
    })
})

describe('typeOf', () => {
    it('returns the type of a plain object as a lowercase string of "object"', () => {
        const result = typeOf({ foo: 'bar' })
        expect(result).toStrictEqual('object')
    })
    it('returns the type of a Symbol as a lowercase string of "symbol"', () => {
        const result = typeOf(Symbol.for('Bob'))
        expect(result).toStrictEqual('symbol')
    })
    it('returns the type of a Function as a lowercase string of "function"', () => {
        const result = typeOf(() => 2)
        expect(result).toStrictEqual('function')
    })
})

describe('isPrimitive', () => {
    it('returns `true` if the object type passed is a primitive type', () => {
        const result = isPrimitive(Symbol.for('primitiveObject'))
        expect(result).toStrictEqual(true)
    })

    it('returns `false` if the object type passed is NOT a primitive type', () => {
        const result = isPrimitive([1, 2, 3, 4])
        expect(result).toStrictEqual(false)
    })
})

describe('isNonPrimitive', () => {
    it('returns `true` if the type of argument is NOT a primitive type', () => {
        const result = isNonPrimitive({ foobar: 'bez' })
        expect(result).toStrictEqual(true)
    })

    it('returns `false` if the object type passed is a primitive type', () => {
        const result = isNonPrimitive(5)
        expect(result).toStrictEqual(false)
    })
})

describe('isPlainObject', () => {
    it('returns true if the type of argument is a plain object', () => {
        const result = isPlainObject({ foo: 'bar' })
        expect(result).toStrictEqual(true)
    })
})

describe('isMap', () => {
    it('returns true if the type of argument is a Map object', () => {
        const result = isMap(new Map())
        expect(result).toStrictEqual(true)
    })
})

describe('isUndefined', () => {
    it('returns `true` if the type of argument is strictly undefined', () => {
        const result = isUndefined(undefined)
        expect(result).toStrictEqual(true)
    })
    it('returns `false` if the type of argument is defined', () => {
        const result = isUndefined('WooHoo!')
        expect(result).toStrictEqual(false)
    })
})

describe('isError', () => {
    it('returns `true` if the passed object extends the `Error` interface', () => {
        const result = isError(new Error('!!!'))
        expect(result).toStrictEqual(true)
    })

    it('returns `true` if the passed object is a DOMException', () => {
        const result = isError(new DOMException('!!!'))
        expect(result).toStrictEqual(true)
    })

    it('returns `false` if the passed object does not extend the Error interface', () => {
        const result = isError('error')
        expect(result).toStrictEqual(false)
    })
})

const fn = () => 'hello'

describe('isNativeObject', () => {
    it('returns `true` if the type of argument is a "Native" object with no `toString` on its prototype', () => {
        const result = isNativeObject(fn)
        expect(result).toStrictEqual(true)
    })

    it('returns `false` if the type of argument is not a Native object', () => {
        const result = isNativeObject({})
        expect(result).toStrictEqual(false)
    })
})

describe('isEmpty', () => {
    it('returns `true` if a plain object is empty (i.e., has no entries)', () => {
        const result = isEmpty({})
        expect(result).toStrictEqual(true)
    })

    it('returns `true` if a string is empty', () => {
        const result = isEmpty('')
        expect(result).toStrictEqual(true)
    })

    it('returns `true` if an array is empty', () => {
        const result = isEmpty([])
        expect(result).toStrictEqual(true)
    })

    it('returns `false` if a plain object is NOT empty', () => {
        const result = isEmpty({ a: null })
        expect(result).toStrictEqual(false)
    })

    it('returns `false` if a set contains entries', () => {
        const result = isEmpty(new Set([1, 2, 3]))
        expect(result).toStrictEqual(false)
    })
})
