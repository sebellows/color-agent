import { capitalize, camelCase, kebabCase, pascalCase, snakeCase } from './string'

describe('capitalize', () => {
    it('will capitalize the first letter of a string', () => {
        expect(capitalize('steve')).toEqual('Steve')
    })
})

describe('camelCase', () => {
    it('will convert a snake_cased string to camelCase', () => {
        expect(camelCase('snake_case_string')).toEqual('snakeCaseString')
    })

    it('will convert a kebab-cased string to camelCase', () => {
        expect(camelCase('kebab-cased-string')).toEqual('kebabCasedString')
    })

    it('will convert a PascalCased string to camelCase', () => {
        expect(camelCase('PascalCasedString')).toEqual('pascalCasedString')
    })

    it('will convert a sentence into a camelCased single word', () => {
        expect(camelCase('this is a sentence')).toEqual('thisIsASentence')
    })

    it('will convert a dot-separated string to camelCase', () => {
        expect(camelCase('dot.separated.string')).toEqual('dotSeparatedString')
    })

    it('will accept an array of strings to omit from the conversion', () => {
        expect(camelCase('IPAddress', ['IP'])).toEqual('ipAddress')
    })
})

describe('kebabCase', () => {
    it('will convert a camelCased string to kebab-case', () => {
        expect(kebabCase('camelCasedString')).toEqual('camel-cased-string')
    })

    it('will convert a snake_cased string to kebab-case', () => {
        expect(kebabCase('snake_case_string')).toEqual('snake-case-string')
    })

    it('will convert a PascalCased string to kebab-case', () => {
        expect(kebabCase('PascalCasedString')).toEqual('pascal-cased-string')
    })

    it('will convert a sentence into a kebab-cased single word', () => {
        expect(kebabCase('this is a sentence')).toEqual('this-is-a-sentence')
    })

    it('will convert a dot-separated string to kebab-case', () => {
        expect(kebabCase('dot.separated.string')).toEqual('dot-separated-string')
    })

    it('will accept an array of strings to omit from the conversion', () => {
        expect(kebabCase('IPAddress', ['IP'])).toEqual('ip-address')
    })
})

describe('snakeCase', () => {
    it('will convert a camelCased string to snake_case', () => {
        expect(snakeCase('camelCasedString')).toEqual('camel_cased_string')
    })

    it('will convert a kebab-cased string to snake_case', () => {
        expect(snakeCase('kebab-cased-string')).toEqual('kebab_cased_string')
    })

    it('will convert a PascalCased string to snake_case', () => {
        expect(snakeCase('PascalCasedString')).toEqual('pascal_cased_string')
    })

    it('will convert a sentence into a snake_cased single word', () => {
        expect(snakeCase('this is a sentence')).toEqual('this_is_a_sentence')
    })

    it('will convert a dot-separated string to snake_case', () => {
        expect(snakeCase('dot.separated.string')).toEqual('dot_separated_string')
    })

    it('will accept an array of strings to omit from the conversion', () => {
        expect(snakeCase('IPAddress', ['IP'])).toEqual('ip_address')
    })
})

describe('pascalCase', () => {
    it('will convert a camelCased string to PascalCase', () => {
        expect(pascalCase('camelCasedString')).toEqual('CamelCasedString')
    })

    it('will convert a snake_cased string to PascalCase', () => {
        expect(pascalCase('snake_case_string')).toEqual('SnakeCaseString')
    })

    it('will convert a kebab-cased string to PascalCase', () => {
        expect(pascalCase('kebab-cased-string')).toEqual('KebabCasedString')
    })

    it('will convert a sentence into a PascalCased single word', () => {
        expect(pascalCase('this is a sentence')).toEqual('ThisIsASentence')
    })

    it('will convert a dot-separated string to PascalCase', () => {
        expect(pascalCase('dot.separated.string')).toEqual('DotSeparatedString')
    })

    it('will accept an array of strings to omit from the conversion', () => {
        expect(pascalCase('IPAddress', ['IP'])).toEqual('IPAddress')
    })
})
