import { segment, toKeyPath } from './path'

describe('segment', () => {
    it('should result in a single segment when the separator is not present', () => {
        expect(segment('foo', ':')).toEqual(['foo'])
    })

    it('should split by the separator', () => {
        expect(segment('foo:bar:baz', ':')).toEqual(['foo', 'bar', 'baz'])
    })

    it('should not split inside of parens', () => {
        expect(segment('a:(b:c):d', ':')).toEqual(['a', '(b:c)', 'd'])
    })

    it('should not split inside of brackets', () => {
        expect(segment('a:[b:c]:d', ':')).toEqual(['a', '[b:c]', 'd'])
    })

    it('should not split inside of curlies', () => {
        expect(segment('a:{b:c}:d', ':')).toEqual(['a', '{b:c}', 'd'])
    })

    it('should not split inside of double quotes', () => {
        expect(segment('a:"b:c":d', ':')).toEqual(['a', '"b:c"', 'd'])
    })

    it('should not split inside of single quotes', () => {
        expect(segment("a:'b:c':d", ':')).toEqual(['a', "'b:c'", 'd'])
    })

    it('should not crash when double quotes are unbalanced', () => {
        expect(segment('a:"b:c:d', ':')).toEqual(['a', '"b:c:d'])
    })

    it('should not crash when single quotes are unbalanced', () => {
        expect(segment("a:'b:c:d", ':')).toEqual(['a', "'b:c:d"])
    })

    it('should skip escaped double quotes', () => {
        expect(segment(String.raw`a:"b:c\":d":e`, ':')).toEqual(['a', String.raw`"b:c\":d"`, 'e'])
    })

    it('should skip escaped single quotes', () => {
        expect(segment(String.raw`a:'b:c\':d':e`, ':')).toEqual(['a', String.raw`'b:c\':d'`, 'e'])
    })

    it('should split by the escape sequence which is escape as well', () => {
        expect(segment('a\\b\\c\\d', '\\')).toEqual(['a', 'b', 'c', 'd'])
        expect(segment('a\\(b\\c)\\d', '\\')).toEqual(['a', '(b\\c)', 'd'])
        expect(segment('a\\[b\\c]\\d', '\\')).toEqual(['a', '[b\\c]', 'd'])
        expect(segment('a\\{b\\c}\\d', '\\')).toEqual(['a', '{b\\c}', 'd'])
    })
})

describe('toKeyPath', () => {
    it('should parse a simple path', () => {
        expect(toKeyPath('a')).toEqual(['a'])
    })

    it('should parse a dot-separated path', () => {
        expect(toKeyPath('a.b.c')).toEqual(['a', 'b', 'c'])
    })

    it('should parse a path with square brackets', () => {
        expect(toKeyPath('a[b].c')).toEqual(['a', 'b', 'c'])
    })

    it('should handle escaped dots in square brackets', () => {
        expect(toKeyPath('a[b.c].e.f')).toEqual(['a', 'b.c', 'e', 'f'])
    })

    it('should handle multiple square brackets', () => {
        expect(toKeyPath('a[b][c][d]')).toEqual(['a', 'b', 'c', 'd'])
    })

    it('should handle mixed notation with dots and square brackets', () => {
        expect(toKeyPath('a.b[c].d[e]')).toEqual(['a', 'b', 'c', 'd', 'e'])
    })
})
