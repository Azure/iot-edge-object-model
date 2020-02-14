// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getVersion, getVersionNumber } from './versionUtilities';

describe('getVersion', () => {
    it('returns 0.0.0 if given falsy value', () => {
        expect(getVersion(undefined)).toEqual({
            major: 0,
            minor: 0,
            rev: 0
        });
    });

    it('returns 0.0.0 given a value of 0.0', () => {
        expect(getVersion('0.0')).toEqual({
            major: 0,
            minor: 0,
            rev: 0
        });
    });

    it('returns 0.0.0 given a value of 0', () => {
        expect(getVersion('0')).toEqual({
            major: 0,
            minor: 0,
            rev: 0
        });
    });

    it('returns version to specification', () => {
        expect(getVersion('100.x1.1')).toEqual({
            major: 100,
            minor: 0,
            rev: 1
        });
    });
});

describe('getVersionNumber', () => {
    it('returns 0 if given falsy value', () => {
        expect(getVersionNumber(undefined)).toEqual(0);
    });

    it('returns 0 if NaN', () => {
        expect(getVersionNumber('x1')).toEqual(0);
    });

    it('returns expected number', () => {
        // tslint:disable-next-line:no-magic-numbers
        expect(getVersionNumber('12')).toEqual(12);
    });
});
