// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseEdgeModuleSpecificationViewModel } from './baseEdgeModuleSpecificationViewModel';

export interface EdgeHubModuleSpecificationViewModel extends BaseEdgeModuleSpecificationViewModel {
    status: string;
    restartPolicy: string;
}
