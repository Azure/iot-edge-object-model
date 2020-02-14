// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface Version {
    major: number;
    minor: number;
    rev: number;
}

export const getVersion = (versionString: string): Version => {
    if (!versionString) {
        return  {
            major: 0,
            minor: 0,
            rev: 0
        };
    }
    const versionArray = versionString.split('.');
    const major = getVersionNumber(versionArray[0]);
    const minor = versionArray.length >= 2 ? getVersionNumber(versionArray[1]) : 0; // tslint:disable-line:no-magic-numbers
    const rev = versionArray.length >= 3 ? getVersionNumber(versionArray[2]) : 0; // tslint:disable-line:no-magic-numbers

    return {
        major,
        minor,
        rev
    };
};

export const getVersionNumber = (versionString: string): number => {
    if (!versionString) {
        return 0;
    }

    const versionNumber = parseInt(versionString, 10);
    return isNaN(versionNumber) ? 0 : versionNumber;
};
