// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import { sample$EdgeAgentDesiredPropertiesViewModel } from '../../../utilities/testHelpers';
import { BaseEdgeModuleSpecificationViewModel } from '../../../viewModel/baseEdgeModuleSpecificationViewModel';
import { $EdgeAgentDesiredPropertiesViewModel } from '../../../viewModel/$EdgeAgentDesiredPropertiesViewModel';
import { generate$EdgeAgentConfigurationContent, getEdgeAgentModuleSpecification, getEdgeHubModuleSpecification, getBaseModuleSpecification, populateRuntimeSettings } from './$EdgeAgentConfigurationContentGenerator';
import { $EdgeAgentDesiredProperties } from '../model/$EdgeAgentDesiredProperties';

describe('$EdgeAgentConfigurationContentGenerator', () => {
    describe('generate$EdgeAgentConfigurationcContent', () => {
        it('generates object', () => {
            const vm = sample$EdgeAgentDesiredPropertiesViewModel();
            const result = generate$EdgeAgentConfigurationContent(vm) as $EdgeAgentDesiredProperties;

            expect(result.runtime.settings.loggingOptions).toEqual(vm.loggingOptions);
            expect(result.runtime.settings.minDockerVersion).toEqual(vm.minDockerVersion);
            expect(Object.keys(result.runtime.settings.registryCredentials).length).toEqual(1);
            expect(result.runtime.settings.registryCredentials[vm.registyCredentials[0].name].address).toEqual(vm.registyCredentials[0].address);
            expect(result.runtime.settings.registryCredentials[vm.registyCredentials[0].name].password).toEqual(vm.registyCredentials[0].password);
            expect(result.runtime.settings.registryCredentials[vm.registyCredentials[0].name].username).toEqual(vm.registyCredentials[0].username);
            expect(result.runtime.type).toEqual(vm.runtimeType);
            expect(result.schemaVersion).toEqual(vm.schemaVersion);

            expect(result.systemModules.edgeAgent.settings.createOptions).toEqual(vm.edgeAgentModuleSpecificationViewModel.createOptions);
            expect(result.systemModules.edgeAgent.settings.image).toEqual(vm.edgeAgentModuleSpecificationViewModel.image);
            expect(Object.keys(result.systemModules.edgeAgent.env).length).toEqual(1);
            expect(result.systemModules.edgeAgent.env[vm.edgeAgentModuleSpecificationViewModel.environmentVariables[0].name].value)
                .toEqual(vm.edgeAgentModuleSpecificationViewModel.environmentVariables[0].value);
            expect(result.systemModules.edgeAgent.type).toEqual(vm.edgeAgentModuleSpecificationViewModel.type);
            expect(result.systemModules.edgeAgent.version).toEqual(vm.edgeAgentModuleSpecificationViewModel.version);

            expect(result.systemModules.edgeHub.settings.createOptions).toEqual(vm.edgeHubModuleSpecificationViewModel.createOptions);
            expect(result.systemModules.edgeHub.settings.image).toEqual(vm.edgeHubModuleSpecificationViewModel.image);
            expect(Object.keys(result.systemModules.edgeHub.env).length).toEqual(1);
            expect(result.systemModules.edgeHub.env[vm.edgeHubModuleSpecificationViewModel.environmentVariables[0].name].value)
                .toEqual(vm.edgeHubModuleSpecificationViewModel.environmentVariables[0].value);
            expect(result.systemModules.edgeHub.type).toEqual(vm.edgeHubModuleSpecificationViewModel.type);
            expect(result.systemModules.edgeHub.version).toEqual(vm.edgeHubModuleSpecificationViewModel.version);
            expect(result.systemModules.edgeHub.status).toEqual(vm.edgeHubModuleSpecificationViewModel.status);
            expect(result.systemModules.edgeHub.restartPolicy).toEqual(vm.edgeHubModuleSpecificationViewModel.restartPolicy);

            expect(Object.keys(result.modules).length).toEqual(1);
            expect(result.modules[vm.moduleSpecificationViewModels[0].name].settings.createOptions).toEqual(vm.moduleSpecificationViewModels[0].createOptions);
            expect(result.modules[vm.moduleSpecificationViewModels[0].name].settings.image).toEqual(vm.moduleSpecificationViewModels[0].image);
            expect(Object.keys(result.modules[vm.moduleSpecificationViewModels[0].name].env).length).toEqual(1);
            expect(result.modules[vm.moduleSpecificationViewModels[0].name]
                .env[vm.moduleSpecificationViewModels[0].environmentVariables[0].name].value)
                .toEqual(vm.moduleSpecificationViewModels[0].environmentVariables[0].value);
            expect(result.modules[vm.moduleSpecificationViewModels[0].name].type).toEqual(vm.moduleSpecificationViewModels[0].type);
            expect(result.modules[vm.moduleSpecificationViewModels[0].name].version).toEqual(vm.moduleSpecificationViewModels[0].version);
            expect(result.modules[vm.moduleSpecificationViewModels[0].name].status).toEqual(vm.moduleSpecificationViewModels[0].status);
        });
    });

    describe('getAgentModuleSpecification', () => {
        it('returns null when edgeAgentModuleSpecification is null', () => {
            const vm = sample$EdgeAgentDesiredPropertiesViewModel();
            vm.edgeAgentModuleSpecificationViewModel = null;
            expect(getEdgeAgentModuleSpecification(vm)).toBeNull();
        });
    });

    describe('getEdgeHubSpecification', () => {
        it('returns null when edgeHubModuleSpecification is null', () => {
            const vm = sample$EdgeAgentDesiredPropertiesViewModel();
            vm.edgeHubModuleSpecificationViewModel = null;
            expect(getEdgeHubModuleSpecification(vm)).toBeNull();
        });
    });

    describe('getBaseModuleSpecification', () => {
        it('does not set version if it is null | undefined | ""', () => {
            const vm: BaseEdgeModuleSpecificationViewModel = {
                name: 'sample',
                type: 'type',
                createOptions: '{}',
                image: 'image',
                version: '',
                environmentVariables: []
            };

            expect(getBaseModuleSpecification(vm).version).toBeUndefined();
        });

        it('ensures create options is non-null', () => {
            const vm: BaseEdgeModuleSpecificationViewModel = {
                name: 'sample',
                type: 'type',
                createOptions:  null,
                image: 'image',
                version: '',
                environmentVariables: []
            };

            expect(getBaseModuleSpecification(vm).settings.createOptions).toEqual('');
        });

        it('does not set env variables if they are not defined', () => {
            const vm: BaseEdgeModuleSpecificationViewModel = {
                name: 'sample',
                type: 'type',
                createOptions:  null,
                image: 'image',
                version: '',
                environmentVariables: null
            };

            expect(getBaseModuleSpecification(vm).env).toBeUndefined();
        })

        it('does not set env variables if the length is zero', () => {
            const vm: BaseEdgeModuleSpecificationViewModel = {
                name: 'sample',
                type: 'type',
                createOptions:  null,
                image: 'image',
                version: '',
                environmentVariables: []
            };

            expect(getBaseModuleSpecification(vm).env).toBeUndefined();
        });

        it('sets value to "" when environment variable value is null', () => {
            const vm: BaseEdgeModuleSpecificationViewModel = {
                name: 'sample',
                type: 'type',
                createOptions:  null,
                image: 'image',
                version: '',
                environmentVariables: [
                    {
                        name: 'name1',
                        value: null
                    }
                ]
            };

            expect(getBaseModuleSpecification(vm).env.name1.value).toEqual('');
        });
    });

    describe('populateRuntimeSettings', () => {
        it('does not set logging options if view model property not set', () => {
            const vm: $EdgeAgentDesiredPropertiesViewModel = {
                schemaVersion: 'schemaVersion',
                runtimeType: 'runtimeVersion',
                minDockerVersion: 'minDockerVersion',
                loggingOptions: '',
                registyCredentials: [],
                edgeAgentModuleSpecificationViewModel: null,
                edgeHubModuleSpecificationViewModel: null,
                moduleSpecificationViewModels: []
            }

            const desiredProperties: $EdgeAgentDesiredProperties = {
                schemaVersion: "1.0",
                runtime: {
                    type: "type",
                    settings: {
                    }
                },
                systemModules: {
                    edgeAgent: null,
                    edgeHub: null
                },
                modules: {}
            }

            populateRuntimeSettings(vm, desiredProperties);
            expect(desiredProperties.runtime.settings.loggingOptions).toBeUndefined();
        });

        it('does not set mindDockerVersion if view model property not set', () => {
            const vm: $EdgeAgentDesiredPropertiesViewModel = {
                schemaVersion: 'schemaVersion',
                runtimeType: 'runtimeVersion',
                minDockerVersion: '',
                loggingOptions: '',
                registyCredentials: [],
                edgeAgentModuleSpecificationViewModel: null,
                edgeHubModuleSpecificationViewModel: null,
                moduleSpecificationViewModels: []
            }

            const desiredProperties: $EdgeAgentDesiredProperties = {
                schemaVersion: "1.0",
                runtime: {
                    type: "type",
                    settings: {
                    }
                },
                systemModules: {
                    edgeAgent: null,
                    edgeHub: null
                },
                modules: {}
            }

            populateRuntimeSettings(vm, desiredProperties);
            expect(desiredProperties.runtime.settings.minDockerVersion).toBeUndefined();
        });

        it('does not set registryCredentials if view model property not set', () => {
            const vm: $EdgeAgentDesiredPropertiesViewModel = {
                schemaVersion: 'schemaVersion',
                runtimeType: 'runtimeVersion',
                minDockerVersion: '',
                loggingOptions: '',
                registyCredentials: [],
                edgeAgentModuleSpecificationViewModel: null,
                edgeHubModuleSpecificationViewModel: null,
                moduleSpecificationViewModels: []
            }

            const desiredProperties: $EdgeAgentDesiredProperties = {
                schemaVersion: "1.0",
                runtime: {
                    type: "type",
                    settings: {
                    }
                },
                systemModules: {
                    edgeAgent: null,
                    edgeHub: null
                },
                modules: {}
            }

            populateRuntimeSettings(vm, desiredProperties);
            expect(desiredProperties.runtime.settings.registryCredentials).toBeUndefined();
        });
    });
});
