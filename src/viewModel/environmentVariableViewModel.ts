// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export enum EnvironmentVariableValueType {
    string = 'string',
    boolean = 'boolean',
    number = 'number'
}

export interface EnvironmentVariableViewModel {
    name: string;
    value: string;
    valueType: EnvironmentVariableValueType;
}
