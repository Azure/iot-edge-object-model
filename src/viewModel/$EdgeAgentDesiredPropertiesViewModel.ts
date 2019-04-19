// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { EdgeAgentModuleSpecificationViewModel } from './edgeAgentModuleSpecificationViewModel';
import { EdgeHubModuleSpecificationViewModel } from './edgeHubModuleSpecificationViewModel';
import { EdgeModuleSpecificationViewModel } from './edgeModuleSpecificationViewModel';
import { RegistryCredentialViewModel } from './registryCredentialViewModel';

export interface $EdgeAgentDesiredPropertiesViewModel {
    schemaVersion: string;
    runtimeType: string;
    minDockerVersion: string;
    loggingOptions: string;
    registyCredentials: RegistryCredentialViewModel[];
    edgeAgentModuleSpecificationViewModel: EdgeAgentModuleSpecificationViewModel | null;
    edgeHubModuleSpecificationViewModel: EdgeHubModuleSpecificationViewModel | null;
    moduleSpecificationViewModels: EdgeModuleSpecificationViewModel[];
}
