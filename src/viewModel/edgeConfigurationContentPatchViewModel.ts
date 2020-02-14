// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { EdgeModuleSpecificationViewModel } from './edgeModuleSpecificationViewModel';
import { RouteViewModel } from './routeViewModel';
import { StringMap } from '../utilities/stringMap';
import { RegistryCredentialViewModel } from './registryCredentialViewModel';

export interface $EdgeAgentPatchEntries {
    moduleSpecificationViewModels: EdgeModuleSpecificationViewModel[];
    registryCredentials: RegistryCredentialViewModel[];
    additionalEdgeAgentEntries: StringMap<string | object>;
}

export interface $EdgeHubPatchEntries {
    routeViewModels: RouteViewModel[];
    additionalEdgeHubEntries: StringMap<string | object>;
}

export type EdgeConfigurationContentPatchViewModel = $EdgeAgentPatchEntries & $EdgeHubPatchEntries;
