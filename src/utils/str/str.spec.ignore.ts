import '../polyfills';
import * as strUtils from './str';

describe('str.startsWith', () => {
    it('returns true with undefined strings', () => {
        let result: boolean = strUtils.startsWith(undefined, undefined);
        expect(result).toBeTruthy();
    });

    it('returns true with empty strings', () => {
        let result: boolean = strUtils.startsWith('', '');
        expect(result).toBeTruthy();
    });

    it('returns false if the text is an empty string and the substring a valid string', () => {
        let result: boolean = strUtils.startsWith('', 'abc');
        expect(result).toBeFalsy();
    });

    it('returns true if the substring is an empty string', () => {
        let result: boolean = strUtils.startsWith('abcde', '');
        expect(result).toBeTruthy();
    });

    it('returns false if the text is undefined and the substring is an empty string', () => {
        let result: boolean = strUtils.startsWith(undefined, '');
        expect(result).toBeFalsy();
    });

    it('returns false if the text is an empty string and the substring undefined', () => {
        let result: boolean = strUtils.startsWith('', undefined);
        expect(result).toBeFalsy();
    });

    it('returns false if the text is undefined and the substring is valid string', () => {
        let result: boolean = strUtils.startsWith(undefined, 'abcde');
        expect(result).toBeFalsy();
    });

    it('returns false if the text is a valid string and undefined as the substring', () => {
        let result: boolean = strUtils.startsWith('abcde', undefined);
        expect(result).toBeFalsy();
    });

    it('returns true on match (both values are valid strings)', () => {
        let result: boolean = strUtils.startsWith('abcde', 'ab');
        expect(result).toBeTruthy();
    });

    it('returns false on unmatch (both values are valid strings)', () => {
        let result: boolean = strUtils.startsWith('abcde', 'bcd');
        expect(result).toBeFalsy();
    });
});
