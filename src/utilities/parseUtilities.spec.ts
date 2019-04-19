// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import { byteSizeOfChar, byteSizeOfString, chunkStringByBytes, isNullOrUndefined, ensureDate } from './parseUtilities';

describe('parseUtilities', () => {
    describe('byteSizeofChar', () => {
        it('calculates 1-byte characters', () => {
            expect(byteSizeOfChar('!')).toEqual(1);
        });

        it('calculates 2-byte characters', () => {
            expect(byteSizeOfChar('¿')).toEqual(2);
        });

        it('calculates 3-byte characters', () => {
            expect(byteSizeOfChar('≤')).toEqual(3);
        });
    });

    describe('chunkStringByBytes', () => {
        it('returns array of single string if less than byte chunk size', () => {
            const input = 'This should not be broken into arrays, due to a large chunk size';
            const result = chunkStringByBytes(input, 100);
            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(input);
        });
        it('appropriately handles null or empty input', () => {
            expect(chunkStringByBytes(null, 0)).toEqual([]);
            expect(chunkStringByBytes('', 0)).toEqual(['']);
        });

        it('returns array of multiple strings with each string being less than chunk size', () => {
            const result = chunkStringByBytes('This should be broken into 6 arrays, no longer than 10 bytes', 10);
            expect(result.length).toEqual(6);
            result.map(str => {
                expect(str.length).toEqual(10);
            });
        });
        it('handles 3-byte surrogates', () => {
            expect(chunkStringByBytes('Œ„´‰ˇÁ¨ˆØ∏”’',3)).toEqual(['Œ', '„', '´', '‰', 'ˇ', 'Á', '¨', 'ˆ', 'Ø', '∏', '’']);
        });
    });

    describe('byteSizeOfString', () => {
        it('correctly calculates 2-byte characters', () => {
            expect(byteSizeOfString('¿Qué?')).toEqual(7);
        });

        it('correctly calculates 3 and 4-byte character strings', () => {
            expect(byteSizeOfString('あ')).toEqual(3));
            expect(byteSizeOfString('あああ')).toEqual(9));
            expect(byteSizeOfString('ああ𠼮')).toEqual(10));
            expect(byteSizeOfString('𠼮')).toEqual(4);
        });

        it('correctly calculates empty string', () => {
            expect(byteSizeOfString('')).toEqual(0);
        });

        it('correctly calculates standard strings', () => {
            expect(byteSizeOfString('hello, world!')).toEqual(13);
        });
    });

    describe('isNullOrUndefined', () => {
        it('returns true given null value', () => {
            expect(isNullOrUndefined(null)).toEqual(true);
        });

        it('returns true given undefined value', () => {
            expect(isNullOrUndefined(undefined)).toEqual(true);
        });

        it('returns false give "" string value', () => {
            expect(isNullOrUndefined('')).toEqual(false);
        });
    });

    describe('ensureDate', () => {
        it('returns date if give a date instance', () => {
            const date = new Date('12/11/2011');
            expect(ensureDate(date)).toEqual(date);
        });

        it('returns null if given null', () => {
            expect(ensureDate(null)).toBeNull();
        });

        it('returns null if given empty string', () => {
            expect(ensureDate('')).toBeNull();
        });

        it('returns null if string is base year', () => {
            expect(ensureDate('0001-01-01T1')).toBeNull();
        });

        it('returns date given parsable string', () => {
            const date = new Date('7/26/2016');
            expect(ensureDate('7/26/2016').valueOf()).toEqual(date.valueOf());
        });

        it('returns date with NaN epoch given invalid string', () => {
            expect(ensureDate('invalid').valueOf()).toBeNaN();
        });
    });
});
