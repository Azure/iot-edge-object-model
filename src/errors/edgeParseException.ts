// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export class EdgeParseException {
    public type: string;
    public message: string;
    public path: string;

    constructor(path: string) {
        this.type = 'EdgeParseException';
        this.message = `Missing or malformed information at: ${path}`;
        this.path = path;
    }
}
