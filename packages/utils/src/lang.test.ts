import { getType, is, isNativeObject, isNonPrimitive, typeOf } from './lang'

describe('getType', () => {
    it("will extract the constructor type using the 'toString' method on a value's prototype", () => {
        const result = getType({ foo: 'bar' })
        expect(result).toStrictEqual('Object')
    })

    it("will return 'Null' when the passed value is 'null'", () => {
        expect(getType(null)).toStrictEqual('Null')
    })
})

describe('is', () => {
    it('verifies that a passed object in the 1st param matches the lowercase type passed as 2nd param', () => {
        const result = is({ foo: 'bar' }, 'object')
        expect(result).toStrictEqual(true)
    })

    it("will return 'false' if the type does not match the passed object's type", () => {
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

describe('isNonPrimitive', () => {
    it("returns 'true' if the type of argument is NOT a primitive type", () => {
        const result = isNonPrimitive({ foobar: 'bez' })
        expect(result).toStrictEqual(true)
    })

    it("returns 'false' if the object type passed is a primitive type", () => {
        const result = isNonPrimitive(5)
        expect(result).toStrictEqual(false)
    })
})

const fn = () => 'hello'

describe('isNativeObject', () => {
    it("returns 'true' if the type of argument is a \"Native\" object with no 'toString' on its prototype", () => {
        const result = isNativeObject(fn)
        expect(result).toStrictEqual(true)
    })

    it("returns 'false' if the type of argument is not a Native object", () => {
        const result = isNativeObject({})
        expect(result).toStrictEqual(false)
    })
})
