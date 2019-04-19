// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export const chunkStringByBytes = (str: string, chunkSize: number): string[] => {
    if (!str || str.length === 0) {
        return str === '' ? [''] : [];
    }
    const chunks: string[] = [];
    let currentChunk: string = '';
    let currentChunkSize: number = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        let charSize = byteSizeOfChar(char);
        // larger unicode characters have a second (surrogate) character of one byte
        // tslint:disable-next-line:no-magic-numbers
        if (charSize === 3 && i < str.length - 1) {
            // tslint:disable-next-line:no-magic-numbers
            if (byteSizeOfChar(str[i + 1]) === 3) {
                charSize++;
                i++;
            }
        }
        if (currentChunkSize + charSize > chunkSize) {
            chunks.push(currentChunk);
            currentChunk = char;
            currentChunkSize = charSize;
        }
        else {
            currentChunk += char;
            currentChunkSize += charSize;
        }
    }
    chunks.push(currentChunk);
    return chunks;
};

export const byteSizeOfString = (str: string): number => {
    return encodeURI(str).split(/%..|./).length - 1;
};

export const byteSizeOfChar = (char: string): number => {
    const x = char.charCodeAt(0);
    // tslint:disable-next-line:no-magic-numbers
    if (x < 0x80) {
        return 1;
    }
    // tslint:disable-next-line:no-magic-numbers number-literal-format
    if (x > 0x7f && x < 0x800) {
        // tslint:disable-next-line:no-magic-numbers
        return 2;
    }
    else {
        // tslint:disable-next-line:no-magic-numbers
        return 3;
    }
};

export const isNullOrUndefined = <T>(obj?: T): boolean => {
    return typeof obj === typeof undefined || obj === null;
};

export const ensureDate = (date: Date | string): Date | null => {

    if (date instanceof Date) {
        return date;
    }

    if (!date) {
        return null;
    }
    if (date.match('0001-01-01')) {
        return null;
    }

    const dateTime = new Date(date);
    return dateTime;
};
