// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeAgentPatchEntries } from '../../../viewModel/edgeConfigurationContentPatchViewModel';
import { getEdgeModuleSpecification } from './$EdgeAgentConfigurationContentGenerator';
import { PATHS } from '../../../utilities/constants';

export const generate$EdgeAgentConfigurationContentPatch = (patchEntries: $EdgeAgentPatchEntries): object => {
    const patchContent = {};
    const { registryCredentials, moduleSpecificationViewModels, additionalEdgeAgentEntries } = patchEntries;

    registryCredentials.forEach(credential => {
        patchContent[`${PATHS.DESIRED_PROPERTIES}.${PATHS.RUNTIME}.${PATHS.SETTINGS}.${PATHS.REGISTRY_CREDENTIALS}.${credential.name}`] = {
            address: credential.address,
            password: credential.password,
            username: credential.username
        };
    });

    moduleSpecificationViewModels.forEach(moduleSpecificationViewModel => {
        const moduleSpecification = getEdgeModuleSpecification(moduleSpecificationViewModel);
        patchContent[`${PATHS.DESIRED_PROPERTIES}.${PATHS.MODULES}.${moduleSpecificationViewModel.name}`] = moduleSpecification;
    });

    const registryCredentialNames = new Set(registryCredentials.map(s => s.name));
    const moduleNames = new Set(moduleSpecificationViewModels.map(s => s.name));

    Object.keys(additionalEdgeAgentEntries).forEach(key => {
        if (!conflictWithModuleEntry(key, moduleNames) &&
            !conflictWithRegistryCredentialEntry(key, registryCredentialNames)) {

            patchContent[key] = additionalEdgeAgentEntries[key];
        }
    });

    return patchContent;
};

export const conflictWithRegistryCredentialEntry = (key: string, registryCredentialNames: Set<string>): boolean => {
    const customRegistryCredentialDepth = 6;
    if (registryCredentialNames.size === 0) {
        return false;
    }

    if (
        key === PATHS.DESIRED_PROPERTIES ||
        key === `${PATHS.DESIRED_PROPERTIES}.${PATHS.RUNTIME}` ||
        key === `${PATHS.DESIRED_PROPERTIES}.${PATHS.RUNTIME}.${PATHS.SETTINGS}`) {
        return true;
    }

    if (key.startsWith(`${PATHS.DESIRED_PROPERTIES}.${PATHS.RUNTIME}.${PATHS.SETTINGS}.${PATHS.REGISTRY_CREDENTIALS}`)) {
        const pathArray = key.split('.');

        if (pathArray.length > customRegistryCredentialDepth &&
            registryCredentialNames.has(pathArray[customRegistryCredentialDepth - 1])) {
            return true;
        }
    }

    return false;
};

export const conflictWithModuleEntry = (key: string, moduleNames: Set<string>): boolean => {
    const customModuleDepth = 4;
    if (moduleNames.size === 0) {
        return false;
    }

    if (key === PATHS.DESIRED_PROPERTIES) {
        return true;
    }

    if (key.startsWith(`${PATHS.DESIRED_PROPERTIES}.${PATHS.MODULES}`)) {
        const pathArray = key.split('.');

        if (pathArray.length > customModuleDepth &&
            moduleNames.has(pathArray[customModuleDepth - 1])) {
            return true;
        }
    }

    return false;
};
