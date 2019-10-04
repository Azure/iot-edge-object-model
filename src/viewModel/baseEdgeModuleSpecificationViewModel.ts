// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { EnvironmentVariableViewModel } from './environmentVariableViewModel';

export interface BaseEdgeModuleSpecificationViewModel {
    name: string;
    type: string;
    createOptions: string;
    image: string;
    imagePullPolicy: string;
    version: string;
    environmentVariables: EnvironmentVariableViewModel[];
}
