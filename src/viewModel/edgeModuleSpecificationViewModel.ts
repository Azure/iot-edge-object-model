// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseEdgeModuleSpecificationViewModel } from './baseEdgeModuleSpecificationViewModel';
import { StringMap } from '../utilities/stringMap';

export interface EdgeModuleSpecificationViewModel extends BaseEdgeModuleSpecificationViewModel{
    desiredProperties: StringMap<object> | null;
    restartPolicy: string;
    status: string;
    asaModuleInformation?: AsaModuleInformation;
}

export interface AsaModuleInformation {
    jobResourceId: string;
    outdated: boolean;
}
