// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeAgentDesiredPropertiesViewModel } from '../../../viewModel/$EdgeAgentDesiredPropertiesViewModel';
import { $EdgeAgentDesiredProperties, $EdgeAgentModules, $EdgeAgentRegistryCredentials } from '../model/$EdgeAgentDesiredProperties';
import { BaseEdgeModuleSpecification } from '../model/baseEdgeModuleSpecification';
import { BaseEdgeModuleSpecificationViewModel } from '../../../viewModel/baseEdgeModuleSpecificationViewModel';
import { EdgeAgentModuleSpecificationViewModel } from '../../../viewModel/edgeAgentModuleSpecificationViewModel';
import { EdgeHubModuleSpecificationViewModel } from '../../../viewModel/edgeHubModuleSpecificationViewModel';
import { EdgeModuleSpecificationViewModel } from '../../../viewModel/edgeModuleSpecificationViewModel';
import { EdgeParseException } from '../../../errors/edgeParseException';
import { EnvironmentVariableViewModel } from '../../../viewModel/environmentVariableViewModel';
import { RegistryCredentialViewModel } from '../../../viewModel/registryCredentialViewModel';
import { isNullOrUndefined } from '../../../utilities/parseUtilities';
import { PATHS } from '../../../utilities/constants';

export const get$EdgeAgentDesiredPropertiesViewModel = (edgeAgentDesiredProperties: $EdgeAgentDesiredProperties): $EdgeAgentDesiredPropertiesViewModel => {
    ensure$EdgeAgentRuntime(edgeAgentDesiredProperties);
    ensure$EdgeAgentSystemModules(edgeAgentDesiredProperties);

    const $edgeAgentDesiredPropertiesViewModel =  {
        edgeAgentModuleSpecificationViewModel: getEdgeAgentSpecificationViewModel(edgeAgentDesiredProperties),
        edgeHubModuleSpecificationViewModel: getEdgeHubSpecificationViewModel(edgeAgentDesiredProperties),
        loggingOptions: get$EdgeAgentLoggingOptions(edgeAgentDesiredProperties),
        minDockerVersion: get$EdgeAgentMinDockerVersion(edgeAgentDesiredProperties),
        moduleSpecificationViewModels: getModuleSpecificationViewModels(edgeAgentDesiredProperties),
        registryCredentials: get$EdgeAgentRegistryCredentials(edgeAgentDesiredProperties),
        runtimeType: get$EdgeAgentRuntimeType(edgeAgentDesiredProperties),
        schemaVersion: get$EdgeAgentSchemaVersion(edgeAgentDesiredProperties)
    };

    return $edgeAgentDesiredPropertiesViewModel;
};

export const getModuleSpecificationViewModels = (edgeAgentDesiredProperties: $EdgeAgentModules): EdgeModuleSpecificationViewModel[] => {
    const modules = edgeAgentDesiredProperties.modules;
    if (!modules) {
        throw new EdgeParseException([
            PATHS.$EDGE_AGENT,
            PATHS.DESIRED_PROPERTIES,
            PATHS.MODULES].join('.'));
    }

    const moduleSpecifications = Object.keys(modules).map(key => {
        const moduleSpecificationViewModel = getModuleSpecificationViewModel(edgeAgentDesiredProperties, key);
        return moduleSpecificationViewModel;
    });

    return moduleSpecifications;
};

export const getModuleSpecificationViewModel = (edgeAgentDesiredProperties: $EdgeAgentModules, moduleName: string): EdgeModuleSpecificationViewModel => {
    const moduleSpecification = edgeAgentDesiredProperties.modules[moduleName];
    if (!moduleSpecification) {
        throw new EdgeParseException([
            PATHS.$EDGE_AGENT,
            PATHS.DESIRED_PROPERTIES,
            PATHS.MODULES,
            moduleName].join('.'));
    }

    const baseModuleSpecificationViewModel = getBaseEdgeModuleSpecificationViewModel(moduleSpecification, moduleName);
    const moduleSpecificationViewModel: EdgeModuleSpecificationViewModel = {
        createOptions: baseModuleSpecificationViewModel.createOptions,
        desiredProperties: null,
        environmentVariables: baseModuleSpecificationViewModel.environmentVariables,
        image: baseModuleSpecificationViewModel.image,
        imagePullPolicy: baseModuleSpecificationViewModel.imagePullPolicy,
        name: baseModuleSpecificationViewModel.name,
        restartPolicy: '',
        startupOrder: moduleSpecification.startupOrder !== undefined ? moduleSpecification.startupOrder.toString() : undefined,
        status: '',
        type: baseModuleSpecificationViewModel.type,
        version: baseModuleSpecificationViewModel.version
    };

    moduleSpecificationViewModel.restartPolicy = moduleSpecification.restartPolicy;
    if (isNullOrUndefined(moduleSpecification.restartPolicy)) {
        throw new EdgeParseException([
            PATHS.$EDGE_AGENT,
            PATHS.DESIRED_PROPERTIES,
            PATHS.MODULES,
            moduleName,
            PATHS.RESTART_POLICY].join('.'));
    }

    moduleSpecificationViewModel.status = moduleSpecification.status;
    if (isNullOrUndefined(moduleSpecification.status)) {
        throw new EdgeParseException([
            PATHS.$EDGE_AGENT,
            PATHS.DESIRED_PROPERTIES,
            PATHS.MODULES,
            moduleName,
            PATHS.STATUS].join('.'));
    }

    return moduleSpecificationViewModel;
};

export const ensure$EdgeAgentRuntime = (edgeAgentDesiredProperties: $EdgeAgentDesiredProperties) => {
    const runtime = edgeAgentDesiredProperties.runtime;
    if (isNullOrUndefined(runtime)) {
        throw new EdgeParseException([
            PATHS.$EDGE_AGENT,
            PATHS.DESIRED_PROPERTIES,
            PATHS.RUNTIME].join('.'));
    }
};

export const $EdgeAgentRuntimeSettingsPresent = (edgeAgentDesiredProperties: $EdgeAgentRegistryCredentials | $EdgeAgentDesiredProperties): boolean => {
    return (edgeAgentDesiredProperties && edgeAgentDesiredProperties.runtime && edgeAgentDesiredProperties.runtime.settings) ? true : false;
};

export const ensure$EdgeAgentSystemModules = (edgeAgentDesiredProperties: $EdgeAgentDesiredProperties) => {
    if (!edgeAgentDesiredProperties.systemModules) {
        throw new EdgeParseException([
            PATHS.$EDGE_AGENT,
            PATHS.DESIRED_PROPERTIES,
            PATHS.SYSTEM_MODULES].join('.'));
    }
};

export const get$EdgeAgentSchemaVersion = (edgeAgentDesiredProperties: $EdgeAgentDesiredProperties): string => {
    const schemaVersion = edgeAgentDesiredProperties.schemaVersion;
    if (isNullOrUndefined(schemaVersion)) {
        throw new EdgeParseException([
            PATHS.$EDGE_AGENT,
            PATHS.DESIRED_PROPERTIES,
            PATHS.SCHEMA_VERSION].join('.'));
    }

    return schemaVersion;
};

export const get$EdgeAgentRuntimeType = (edgeAgentDesiredProperties: $EdgeAgentDesiredProperties): string => {
    const runtimeType = edgeAgentDesiredProperties.runtime.type;
    if (isNullOrUndefined(runtimeType)) {
        throw new EdgeParseException([
            PATHS.$EDGE_AGENT,
            PATHS.DESIRED_PROPERTIES,
            PATHS.RUNTIME,
            PATHS.TYPE].join('.'));
    }

    return runtimeType;
};

export const get$EdgeAgentMinDockerVersion = (edgeAgentDesiredProperties: $EdgeAgentDesiredProperties): string => {
    if (!$EdgeAgentRuntimeSettingsPresent(edgeAgentDesiredProperties))  {
        return '';
    }

    const minDockerVersion = edgeAgentDesiredProperties.runtime.settings.minDockerVersion;
    if (!minDockerVersion) {
        return '';
    }

    return minDockerVersion;
};

export const get$EdgeAgentLoggingOptions = (edgeAgentDesiredProperties: $EdgeAgentDesiredProperties): string => {
    if (!$EdgeAgentRuntimeSettingsPresent(edgeAgentDesiredProperties)) {
        return '';
    }

    const loggingOptions = edgeAgentDesiredProperties.runtime.settings.loggingOptions;
    if (!loggingOptions) {
        return '';
    }

    return loggingOptions;
};

export const get$EdgeAgentRegistryCredentials = (edgeAgentDesiredProperties: $EdgeAgentRegistryCredentials): RegistryCredentialViewModel[] => {
    if (!$EdgeAgentRuntimeSettingsPresent(edgeAgentDesiredProperties))  {
        return [];
    }

    const registryCredentialViewModels: RegistryCredentialViewModel[] = [];
    const registryCredentials = edgeAgentDesiredProperties.runtime.settings.registryCredentials;

    if (!registryCredentials) {
        return registryCredentialViewModels;
    }

    return Object.keys(registryCredentials).map(key => {

        const registryCredential = registryCredentials[key];
        if (!registryCredential) {
            throw new EdgeParseException([
                PATHS.$EDGE_AGENT,
                PATHS.DESIRED_PROPERTIES,
                PATHS.RUNTIME,
                PATHS.SETTINGS,
                PATHS.REGISTRY_CREDENTIALS,
                key].join('.'));
        }

        const address = registryCredential.address;
        const username = registryCredential.username;
        const password = registryCredential.password;

        if (isNullOrUndefined(address)) {
            throw new EdgeParseException([
                PATHS.$EDGE_AGENT,
                PATHS.DESIRED_PROPERTIES,
                PATHS.RUNTIME,
                PATHS.SETTINGS,
                PATHS.REGISTRY_CREDENTIALS,
                key,
                PATHS.ADDRESS].join('.'));
        }

        if (isNullOrUndefined(username)) {
            throw new EdgeParseException([
                PATHS.$EDGE_AGENT,
                PATHS.DESIRED_PROPERTIES,
                PATHS.RUNTIME,
                PATHS.SETTINGS,
                PATHS.REGISTRY_CREDENTIALS,
                key,
                PATHS.USERNAME].join('.'));
        }

        if (isNullOrUndefined(password)) {
            throw new EdgeParseException([
                PATHS.$EDGE_AGENT,
                PATHS.DESIRED_PROPERTIES,
                PATHS.RUNTIME,
                PATHS.SETTINGS,
                PATHS.REGISTRY_CREDENTIALS,
                key,
                PATHS.PASSWORD].join('.'));
        }

        const registryCredentialViewModel: RegistryCredentialViewModel = {
            address,
            name: key,
            password,
            username
        };

        return registryCredentialViewModel;
    });
};

export const getEdgeAgentSpecificationViewModel = (edgeAgentDesiredProperties: $EdgeAgentDesiredProperties): EdgeAgentModuleSpecificationViewModel => {
    const edgeAgent = edgeAgentDesiredProperties.systemModules.edgeAgent;
    if (!edgeAgent) {
        throw new EdgeParseException([
            PATHS.$EDGE_AGENT,
            PATHS.DESIRED_PROPERTIES,
            PATHS.SYSTEM_MODULES,
            PATHS.EDGE_AGENT].join('.'));
    }

    // edge agent and base have no difference
    const moduleSpecificationViewModel = getBaseEdgeModuleSpecificationViewModel(edgeAgent, PATHS.EDGE_AGENT, true);
    return moduleSpecificationViewModel;
};

export const getEdgeHubSpecificationViewModel = (edgeAgentDesiredProperties: $EdgeAgentDesiredProperties): EdgeHubModuleSpecificationViewModel => {
    const edgeHub = edgeAgentDesiredProperties.systemModules.edgeHub;
    if (!edgeHub) {
        throw new EdgeParseException([
            PATHS.$EDGE_AGENT,
            PATHS.DESIRED_PROPERTIES,
            PATHS.SYSTEM_MODULES,
            PATHS.EDGE_HUB].join('.'));
    }

    const restartPolicy = edgeHub.restartPolicy;
    if (isNullOrUndefined(restartPolicy)) {
        throw new EdgeParseException([
            PATHS.$EDGE_AGENT,
            PATHS.DESIRED_PROPERTIES,
            PATHS.SYSTEM_MODULES,
            PATHS.EDGE_HUB,
            PATHS.RESTART_POLICY].join('.'));
    }

    const status = edgeHub.status;
    if (isNullOrUndefined(status)) {
        throw new EdgeParseException([
            PATHS.$EDGE_AGENT,
            PATHS.DESIRED_PROPERTIES,
            PATHS.SYSTEM_MODULES,
            PATHS.EDGE_HUB,
            PATHS.STATUS].join('.'));
    }

    const baseModuleSpecificationViewModel = getBaseEdgeModuleSpecificationViewModel(edgeHub, PATHS.EDGE_HUB, true);
    const moduleSpecificationViewModel: EdgeHubModuleSpecificationViewModel = {
        createOptions: baseModuleSpecificationViewModel.createOptions,
        environmentVariables: baseModuleSpecificationViewModel.environmentVariables,
        image: baseModuleSpecificationViewModel.image,
        imagePullPolicy: baseModuleSpecificationViewModel.imagePullPolicy,
        name: baseModuleSpecificationViewModel.name,
        restartPolicy,
        startupOrder: edgeHub.startupOrder !== undefined ? edgeHub.startupOrder.toString() : undefined,
        status,
        type: baseModuleSpecificationViewModel.type,
        version: baseModuleSpecificationViewModel.version
    };

    return moduleSpecificationViewModel;
};

export const getBaseEdgeModuleSpecificationViewModel = (moduleSpecification: BaseEdgeModuleSpecification, name: string, systemModule = false): BaseEdgeModuleSpecificationViewModel => {
    const baseModuleSpecificationViewModel: BaseEdgeModuleSpecificationViewModel = {
        createOptions: '',
        environmentVariables: [],
        image: '',
        imagePullPolicy: '',
        name,
        type: moduleSpecification.type,
        version: ''
    };

    if (isNullOrUndefined(baseModuleSpecificationViewModel.type)) {
        throw new EdgeParseException([
            PATHS.$EDGE_AGENT,
            PATHS.DESIRED_PROPERTIES,
            systemModule ? PATHS.SYSTEM_MODULES : PATHS.MODULES,
            name,
            PATHS.TYPE].join('.'));
    }

    if (!moduleSpecification.settings) {
        throw new EdgeParseException([
            PATHS.$EDGE_AGENT,
            PATHS.DESIRED_PROPERTIES,
            systemModule ? PATHS.SYSTEM_MODULES : PATHS.MODULES,
            name,
            PATHS.SETTINGS].join('.'));
    }

    if (moduleSpecification.settings.createOptions && typeof(moduleSpecification.settings.createOptions) !== 'string') {
        throw new EdgeParseException([
            PATHS.$EDGE_AGENT,
            PATHS.SETTINGS,
            PATHS.CREATE_OPTIONS].join('.'));
    }

    if (moduleSpecification.settings.createOptions01) {
        const settings = moduleSpecification.settings;
        settings.createOptions = [settings.createOptions, settings.createOptions01, settings.createOptions02, settings.createOptions03, settings.createOptions04, settings.createOptions05, settings.createOptions06, settings.createOptions07].join('');
        try {
            JSON.parse(settings.createOptions);
        }
        catch (exception) {
            throw new EdgeParseException([
                PATHS.$EDGE_AGENT,
                PATHS.SETTINGS,
                PATHS.CREATE_OPTIONS].join('.'));
        }
    }

    if (moduleSpecification.imagePullPolicy) {
        baseModuleSpecificationViewModel.imagePullPolicy = moduleSpecification.imagePullPolicy;
    }

    baseModuleSpecificationViewModel.createOptions = moduleSpecification.settings.createOptions ? moduleSpecification.settings.createOptions : '';
    baseModuleSpecificationViewModel.image = moduleSpecification.settings.image;
    if (isNullOrUndefined(baseModuleSpecificationViewModel.image)) {
        throw new EdgeParseException([
            PATHS.$EDGE_AGENT,
            PATHS.DESIRED_PROPERTIES,
            systemModule ? PATHS.SYSTEM_MODULES : PATHS.MODULES,
            name,
            PATHS.SETTINGS,
            PATHS.IMAGE].join('.'));
    }

    const version = moduleSpecification.version;
    if (version) {
        baseModuleSpecificationViewModel.version = version;
    }

    if (moduleSpecification.env) {
        const env = moduleSpecification.env;
        const environmentVariables = Object.keys(env).map(key => {
            const envVariable = env[key];
            if (!envVariable) {
                throw new EdgeParseException([
                    PATHS.$EDGE_AGENT,
                    PATHS.DESIRED_PROPERTIES,
                    systemModule ? PATHS.SYSTEM_MODULES : PATHS.MODULES,
                    name,
                    PATHS.ENV,
                    key].join('.'));
            }

            if (isNullOrUndefined(envVariable.value)) {
                throw new EdgeParseException([
                    PATHS.$EDGE_AGENT,
                    PATHS.DESIRED_PROPERTIES,
                    systemModule ? PATHS.SYSTEM_MODULES : PATHS.MODULES,
                    name,
                    PATHS.ENV,
                    key,
                    PATHS.VALUE].join('.'));
            }

            const environmentVariableViewModel: EnvironmentVariableViewModel  = {
                name: key,
                value: envVariable.value
            };

            return environmentVariableViewModel;
        });

        baseModuleSpecificationViewModel.environmentVariables = environmentVariables;
    }

    return baseModuleSpecificationViewModel;
};
