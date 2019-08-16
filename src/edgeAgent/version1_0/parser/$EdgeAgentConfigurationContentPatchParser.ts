// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { PATHS } from '../../../utilities/constants';
import { $EdgeAgentPatchEntries } from '../../../viewModel/edgeConfigurationContentPatchViewModel';
import { StringMap } from '../../../utilities/stringMap';
import { EdgeModuleSpecificationViewModel } from '../../../viewModel/edgeModuleSpecificationViewModel';
import { getModuleSpecificationViewModel, getModuleSpecificationViewModels, get$EdgeAgentRegistryCredentials } from './$EdgeAgentDesiredPropertiesParser';
import { getModuleSpecificationDesiredProperties } from './$EdgeAgentConfigurationContentParser';

export const get$EdgeAgentPatchEntries = ($edgeAgent: object, modulesContent: StringMap<object>): $EdgeAgentPatchEntries => {
    const entries: $EdgeAgentPatchEntries = {
        additionalEdgeAgentEntries: {},
        moduleSpecificationViewModels: [],
        registryCredentials: [],
    };

    if (!$edgeAgent) {
        return entries;
    }

    const payload: Payload = {
        $edgeEntries: entries,
        $edgeObject: $edgeAgent,
        key: '',
        pathArray: []
    };

    Object.keys($edgeAgent).forEach(key => {
        const pathArray = key.split('.');
        payload.key = key;
        payload.pathArray = pathArray;

        if (!filterRegistryCredentials(payload) && !filterModules(payload)) {
            entries.additionalEdgeAgentEntries[key] = $edgeAgent[key];
        }
    });

    applyModuleSpecificationTwinSettings(modulesContent, entries.moduleSpecificationViewModels);
    return entries;
};

export const applyModuleSpecificationTwinSettings = (modulesContent: StringMap<object>, moduleSpecificationViewModels: EdgeModuleSpecificationViewModel[]) => {
    moduleSpecificationViewModels.forEach(moduleSpecificationViewModel => {
        moduleSpecificationViewModel.desiredProperties = getModuleSpecificationDesiredProperties(modulesContent, moduleSpecificationViewModel.name);
    });
};

export interface Payload {
    $edgeObject: object;
    $edgeEntries: $EdgeAgentPatchEntries;
    key: string;
    pathArray: string[];
}

export const filterRegistryCredentials = (payload: Payload): boolean => {
    const registryCredentialsPathDepth = 5; // properties.desired.runtime.settings.registryCredentials
    const registryCredentialPathDepth = 6; // properties.desired.runtime.settings.registryCredentials.x
    const { $edgeEntries, $edgeObject, key, pathArray } = payload;

     // get registry credentials
    if (pathArray.length >= registryCredentialsPathDepth &&
        pathArray[registryCredentialsPathDepth - 1] === PATHS.REGISTRY_CREDENTIALS) {

            if (pathArray.length === registryCredentialsPathDepth) {
                const registryCredentialsObject = {
                    runtime: {
                        settings:  {
                            registryCredentials: $edgeObject[key]
                        }
                    }
                };

                const registryCredentialViewModels = get$EdgeAgentRegistryCredentials(registryCredentialsObject);
                $edgeEntries.registryCredentials.push(...registryCredentialViewModels);
                return true;
            }

            if (pathArray.length === registryCredentialPathDepth) {
                const registryCredentialName = pathArray[registryCredentialPathDepth - 1];
                const registryCredentialObject = {
                    runtime: {
                        settings: {
                            registryCredentials: {}
                        }
                    }
                };

                registryCredentialObject.runtime.settings.registryCredentials[registryCredentialName] = $edgeObject[key];
                $edgeEntries.registryCredentials.push(...get$EdgeAgentRegistryCredentials(registryCredentialObject));
                return true;
            }
    }

    return false;
};

export const filterModules = (payload: Payload): boolean => {
    const modulesPathDepth = 3; // properties.desired.modules
    const modulePathDepth = 4; // properties.desired.modules.x
    const { $edgeEntries, $edgeObject, key, pathArray } = payload;

    if (pathArray.length >= modulesPathDepth &&
        pathArray[modulesPathDepth - 1] === PATHS.MODULES) {

            if (pathArray.length === modulesPathDepth) {
                const modulesObject = {
                    modules: $edgeObject[key]
                };

                const moduleViewModels = getModuleSpecificationViewModels(modulesObject);
                $edgeEntries.moduleSpecificationViewModels.push(...moduleViewModels);
                return true;
            }

            if (pathArray.length === modulePathDepth) {
                const moduleName = pathArray[modulePathDepth - 1];
                const moduleObject = {
                    modules: {}
                };

                moduleObject.modules[moduleName] = $edgeObject[key];
                $edgeEntries.moduleSpecificationViewModels.push(getModuleSpecificationViewModel(moduleObject, moduleName));
                return true;
            }
    }

    return false;
};
