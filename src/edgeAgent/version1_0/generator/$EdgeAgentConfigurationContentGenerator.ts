// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeAgentDesiredPropertiesViewModel } from '../../../viewModel/$EdgeAgentDesiredPropertiesViewModel';
import { $EdgeAgentDesiredProperties } from '../model/$EdgeAgentDesiredProperties';
import { BaseEdgeModuleSpecification } from '../model/baseEdgeModuleSpecification';
import { BaseEdgeModuleSpecificationViewModel } from '../../../viewModel/baseEdgeModuleSpecificationViewModel';
import { EdgeAgentModuleSpecification } from '../model/edgeAgentModuleSpecification';
import { $EDGE_AGENT, CREATE_OPTIONS_CHUNK_SIZE } from '../../../utilities/constants';
import { EdgeHubModuleSpecification } from '../model/edgeHubModuleSpecification';
import { EdgeModuleSpecification } from '../model/edgeModuleSpecification';
import { EdgeModuleSpecificationViewModel } from '../../../viewModel/edgeModuleSpecificationViewModel';
import { chunkStringByBytes } from '../../../utilities/parseUtilities';
import { EnvironmentVariable } from '../model/environmentVariable';
import { RegistryCredential } from '../model/registryCredential';
import { StringMap } from '../../../utilities/stringMap';

export const generate$EdgeAgentConfigurationContent = (edgeAgentDesiredPropertiesViewModel: $EdgeAgentDesiredPropertiesViewModel): object => {
    const edgeAgentModuleSpecification = getEdgeAgentModuleSpecification(edgeAgentDesiredPropertiesViewModel);
    const edgeHubModuleSpecification = getEdgeHubModuleSpecification(edgeAgentDesiredPropertiesViewModel);
    const edgeAgentDesiredProperties: $EdgeAgentDesiredProperties = {
        modules: {},
        runtime: {
            settings: {},
            type: edgeAgentDesiredPropertiesViewModel.runtimeType
        },
        schemaVersion: $EDGE_AGENT.SCHEMA_VERSION_1_0,
        systemModules: {
            edgeAgent: edgeAgentModuleSpecification,
            edgeHub: edgeHubModuleSpecification
        },
    };

    populateRuntimeSettings(edgeAgentDesiredPropertiesViewModel, edgeAgentDesiredProperties);
    populateModules(edgeAgentDesiredPropertiesViewModel, edgeAgentDesiredProperties);
    return edgeAgentDesiredProperties;
};

export const getEdgeAgentModuleSpecification = (edgeAgentDesiredPropertiesViewModel: $EdgeAgentDesiredPropertiesViewModel): EdgeAgentModuleSpecification  | null => {
    if (!edgeAgentDesiredPropertiesViewModel.edgeAgentModuleSpecificationViewModel) {
        return null;
    }

    const edgeAgentModuleSpecification = getBaseModuleSpecification<EdgeAgentModuleSpecification>(edgeAgentDesiredPropertiesViewModel.edgeAgentModuleSpecificationViewModel);
    return edgeAgentModuleSpecification;
};

export const getEdgeHubModuleSpecification = (edgeAgentDesiredPropertiesViewModel: $EdgeAgentDesiredPropertiesViewModel): EdgeHubModuleSpecification | null => {
    if (!edgeAgentDesiredPropertiesViewModel.edgeHubModuleSpecificationViewModel) {
        return null;
    }

    const edgeHubModuleSpecification = getBaseModuleSpecification<EdgeHubModuleSpecification>(edgeAgentDesiredPropertiesViewModel.edgeHubModuleSpecificationViewModel);
    edgeHubModuleSpecification.status = edgeAgentDesiredPropertiesViewModel.edgeHubModuleSpecificationViewModel.status;
    edgeHubModuleSpecification.restartPolicy = edgeAgentDesiredPropertiesViewModel.edgeHubModuleSpecificationViewModel.restartPolicy;

    return edgeHubModuleSpecification;
};

export const getEdgeModuleSpecification = (edgeModuleSpecificationViewModel: EdgeModuleSpecificationViewModel): EdgeModuleSpecification => {
    const edgeModuleSpecification = getBaseModuleSpecification<EdgeModuleSpecification>(edgeModuleSpecificationViewModel) as EdgeModuleSpecification;
    edgeModuleSpecification.status = edgeModuleSpecificationViewModel.status;
    edgeModuleSpecification.restartPolicy = edgeModuleSpecificationViewModel.restartPolicy;
    edgeModuleSpecification.version =  $EDGE_AGENT.DEFAULT_MODULE_VERSION;

    return edgeModuleSpecification;
};

export const getBaseModuleSpecification = <T extends BaseEdgeModuleSpecification>(baseEdgeModuleSpecificationViewModel: BaseEdgeModuleSpecificationViewModel): T => {
    const edgeModuleSpecification: BaseEdgeModuleSpecification = {
        settings: {
            image: baseEdgeModuleSpecificationViewModel.image
        },
        type: baseEdgeModuleSpecificationViewModel.type,
    };

    // version
    if (baseEdgeModuleSpecificationViewModel.version) {
        edgeModuleSpecification.version = baseEdgeModuleSpecificationViewModel.version;
    }

    // create options
    if (baseEdgeModuleSpecificationViewModel.createOptions) {
        const optionsCopy = baseEdgeModuleSpecificationViewModel.createOptions.slice();
        const createOptions = chunkStringByBytes(optionsCopy, CREATE_OPTIONS_CHUNK_SIZE);
        edgeModuleSpecification.settings.createOptions = createOptions[0];
        edgeModuleSpecification.settings.createOptions01 = createOptions[1]; // tslint:disable-line:no-magic-numbers
        edgeModuleSpecification.settings.createOptions02 = createOptions[2]; // tslint:disable-line:no-magic-numbers
        edgeModuleSpecification.settings.createOptions03 = createOptions[3]; // tslint:disable-line:no-magic-numbers
        edgeModuleSpecification.settings.createOptions04 = createOptions[4]; // tslint:disable-line:no-magic-numbers
        edgeModuleSpecification.settings.createOptions05 = createOptions[5]; // tslint:disable-line:no-magic-numbers
        edgeModuleSpecification.settings.createOptions06 = createOptions[6]; // tslint:disable-line:no-magic-numbers
        edgeModuleSpecification.settings.createOptions07 = createOptions[7]; // tslint:disable-line:no-magic-numbers
    }
    // fix for null or empty createOptions
    if (!edgeModuleSpecification.settings.createOptions) {
        edgeModuleSpecification.settings.createOptions = '';
    }

    // environment variables
    if (baseEdgeModuleSpecificationViewModel.environmentVariables &&
        baseEdgeModuleSpecificationViewModel.environmentVariables.length > 0) {

        const envEntries: StringMap<EnvironmentVariable> = {};
        baseEdgeModuleSpecificationViewModel.environmentVariables.forEach(environmentVariable => {

            envEntries[environmentVariable.name] = {
                value: environmentVariable.value || ''
            };
        });

        edgeModuleSpecification.env = envEntries;
    }

    return edgeModuleSpecification as T;
};

export const populateRuntimeSettings = (edgeAgentDesiredPropertiesViewModel: $EdgeAgentDesiredPropertiesViewModel, edgeAgentDesiredProperties: $EdgeAgentDesiredProperties) => {
    // logging
    if (edgeAgentDesiredPropertiesViewModel.loggingOptions) {
        edgeAgentDesiredProperties.runtime.settings.loggingOptions = edgeAgentDesiredPropertiesViewModel.loggingOptions;
    }

    // minDockerVersion
    if (edgeAgentDesiredPropertiesViewModel.minDockerVersion) {
        edgeAgentDesiredProperties.runtime.settings.minDockerVersion = edgeAgentDesiredPropertiesViewModel.minDockerVersion;
    }

    // registryCredential
    if (edgeAgentDesiredPropertiesViewModel.registyCredentials &&
        edgeAgentDesiredPropertiesViewModel.registyCredentials.length > 0) {

        const registryCredentials: StringMap<RegistryCredential> = {};
        edgeAgentDesiredPropertiesViewModel.registyCredentials.forEach(registryCredential => {

            registryCredentials[registryCredential.name] = {
                address: registryCredential.address,
                password: registryCredential.password,
                username: registryCredential.username
            };
        });

        edgeAgentDesiredProperties.runtime.settings.registryCredentials = registryCredentials;
    }
};

export const populateModules = (edgeAgentDesiredPropertiesViewModel: $EdgeAgentDesiredPropertiesViewModel, edgeAgentDesiredProperties: $EdgeAgentDesiredProperties) => {
    edgeAgentDesiredPropertiesViewModel.moduleSpecificationViewModels.forEach(moduleSpecificationViewModel => {
        const moduleSpecification = getEdgeModuleSpecification(moduleSpecificationViewModel);
        edgeAgentDesiredProperties.modules[moduleSpecificationViewModel.name] = moduleSpecification;
    });
};
