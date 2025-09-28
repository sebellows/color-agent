import { titleCase } from './string'

describe('titleCase', () => {
    it('will capitalize the first letter of every word in a string', () => {
        expect(titleCase('i am a scientist!')).toEqual('I Am A Scientist!')
    })
})
