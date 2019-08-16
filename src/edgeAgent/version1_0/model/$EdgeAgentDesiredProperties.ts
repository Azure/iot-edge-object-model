// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { EdgeAgentModuleSpecification } from './edgeAgentModuleSpecification';
import { EdgeHubModuleSpecification } from './edgeHubModuleSpecification';
import { EdgeModuleSpecification } from './edgeModuleSpecification';
import { RegistryCredential } from './registryCredential';
import { StringMap } from '../../../utilities/stringMap';

export interface $EdgeAgentModules {
    modules: StringMap<EdgeModuleSpecification>;
}

export interface $EdgeAgentRegistryCredentials {
    runtime: {
        settings: {
            registryCredentials?: StringMap<RegistryCredential>
        }
    };
}

export interface $EdgeAgentProperties {
    schemaVersion: string;
    runtime: {
        type: string;
        settings: {
            minDockerVersion?: string;
            loggingOptions?: string;
        }
    };
    systemModules: {
        edgeAgent: EdgeAgentModuleSpecification | null;
        edgeHub: EdgeHubModuleSpecification | null;
    };
}

export type $EdgeAgentDesiredProperties = $EdgeAgentModules & $EdgeAgentProperties & $EdgeAgentRegistryCredentials;
