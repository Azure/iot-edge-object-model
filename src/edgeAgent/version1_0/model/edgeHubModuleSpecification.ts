// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseEdgeModuleSpecification } from './baseEdgeModuleSpecification';

export interface EdgeHubModuleSpecification extends BaseEdgeModuleSpecification {
    status: string;
    restartPolicy: string;
}
