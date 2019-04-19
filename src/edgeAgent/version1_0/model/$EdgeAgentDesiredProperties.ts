// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { EdgeAgentModuleSpecification } from './edgeAgentModuleSpecification';
import { EdgeHubModuleSpecification } from './edgeHubModuleSpecification';
import { EdgeModuleSpecification } from './edgeModuleSpecification';
import { RegistryCredential } from './registryCredential';
import { StringMap } from '../../../utilities/stringMap';

export interface $EdgeAgentDesiredProperties {
    schemaVersion: string;
    runtime: {
        type: string;
        settings: {
            minDockerVersion?: string;
            loggingOptions?: string;
            registryCredentials?: StringMap<RegistryCredential>
        }
    };
    systemModules: {
        edgeAgent: EdgeAgentModuleSpecification | null;
        edgeHub: EdgeHubModuleSpecification | null;
    };
    modules: StringMap<EdgeModuleSpecification>;
}
