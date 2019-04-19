// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export class EdgeUnsupportedSchemaException {
    public type: string;
    public message: string;

    constructor(schemaVersion: string) {
        this.type = 'EdgeParseException';
        this.message = `Schema version ${schemaVersion} is not supported`;
    }
}
