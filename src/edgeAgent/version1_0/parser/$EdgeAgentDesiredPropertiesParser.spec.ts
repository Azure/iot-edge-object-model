// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import {
    get$EdgeAgentDesiredPropertiesViewModel,
    getModuleSpecificationViewModels,
    getModuleSpecificationViewModel,
    ensure$EdgeAgentRuntime,
    ensure$EdgeAgentSystemModules,
    $EdgeAgentRuntimeSettingsPresent,
    get$EdgeAgentSchemaVersion,
    get$EdgeAgentRuntimeType,
    get$EdgeAgentMinDockerVersion,
    get$EdgeAgentLoggingOptions,
    get$EdgeAgentRegistryCredentials,
    getEdgeAgentSpecificationViewModel,
    getEdgeHubSpecificationViewModel,
    getBaseEdgeModuleSpecificationViewModel
} from './$EdgeAgentDesiredPropertiesParser';
import { sample$EdgeAgentModuleTwin } from '../../../utilities/testHelpers';

describe('$EdgeAgentDesiredPropertiesParser', () => {
    describe('get$EdgeAgentDesiredPropertiesViewModel', () => {
        it('returns view model meeting specifications', () => {

            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            const desiredProperties = edgeAgentTwin.properties.desired;
            const result = get$EdgeAgentDesiredPropertiesViewModel(desiredProperties as any);

            expect(result.edgeAgentModuleSpecificationViewModel).not.toBeNull();
            expect(result.edgeAgentModuleSpecificationViewModel.createOptions).toEqual('{}');
            expect(result.edgeAgentModuleSpecificationViewModel.environmentVariables.length).toEqual(1);
            expect(result.edgeAgentModuleSpecificationViewModel.environmentVariables[0].name).toEqual('edgeAgentVar1');
            expect(result.edgeAgentModuleSpecificationViewModel.environmentVariables[0].value).toEqual('edgeAgentVar1Value');
            expect(result.edgeAgentModuleSpecificationViewModel.image).toEqual('mcr/azureiotedge-agent:1.0-preview');
            expect(result.edgeAgentModuleSpecificationViewModel.name).toEqual('edgeAgent');
            expect(result.edgeAgentModuleSpecificationViewModel.type).toEqual('docker');
            expect(result.edgeAgentModuleSpecificationViewModel.version).toEqual('1.0');

            expect(result.edgeHubModuleSpecificationViewModel).not.toBeNull();
            expect(result.edgeHubModuleSpecificationViewModel.createOptions).toEqual(JSON.stringify({ Env: 'value'}));
            expect(result.edgeHubModuleSpecificationViewModel.environmentVariables.length).toEqual(1);
            expect(result.edgeHubModuleSpecificationViewModel.environmentVariables[0].name).toEqual('edgeHubVar1');
            expect(result.edgeHubModuleSpecificationViewModel.environmentVariables[0].value).toEqual('edgeHubVar1Value');
            expect(result.edgeHubModuleSpecificationViewModel.image).toEqual('mcr/azureiotedge-hub:1.0-preview');
            expect(result.edgeHubModuleSpecificationViewModel.name).toEqual('edgeHub');
            expect(result.edgeHubModuleSpecificationViewModel.restartPolicy).toEqual('always');
            expect(result.edgeHubModuleSpecificationViewModel.status).toEqual('running');
            expect(result.edgeHubModuleSpecificationViewModel.type).toEqual('docker');
            expect(result.edgeHubModuleSpecificationViewModel.version).toEqual('');

            expect(result.moduleSpecificationViewModels.length).toEqual(1);
            expect(result.moduleSpecificationViewModels[0].createOptions).toEqual('{\'key\':\'value\'}');
            expect(result.moduleSpecificationViewModels[0].desiredProperties).toBeNull();
            expect(result.moduleSpecificationViewModels[0].environmentVariables.length).toEqual(1);
            expect(result.moduleSpecificationViewModels[0].environmentVariables[0].name).toEqual('edgeCustomModuleVar1');
            expect(result.moduleSpecificationViewModels[0].environmentVariables[0].value).toEqual('edgeCustomModuleVar1Value');
            expect(result.moduleSpecificationViewModels[0].image).toEqual('mcr/azureiotedge-simulated-temperature-sensor:1.0-preview');
            expect(result.moduleSpecificationViewModels[0].name).toEqual('tempSensor');
            expect(result.moduleSpecificationViewModels[0].restartPolicy).toEqual('always');
            expect(result.moduleSpecificationViewModels[0].status).toEqual('running');
            expect(result.moduleSpecificationViewModels[0].type).toEqual('docker');
            expect(result.moduleSpecificationViewModels[0].version).toEqual('1.0');

            expect(result.loggingOptions).toEqual('loggingOption');
            expect(result.minDockerVersion).toEqual('v1.25');
            expect(result.runtimeType).toEqual('docker');
            expect(result.schemaVersion).toEqual('1.0');
            expect(result.registyCredentials).not.toBeNull();
            expect(result.registyCredentials.length).toEqual(1);
            expect(result.registyCredentials[0].address).toEqual('address1');
            expect(result.registyCredentials[0].username).toEqual('username1');
            expect(result.registyCredentials[0].password).toEqual('password1');
            expect(result.registyCredentials[0].name).toEqual('credential1');
        });
    });

    describe('getModuleSpecificationViewModels', () => {
        it('throws exception if modules is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.modules = null;
            expect(() => { getModuleSpecificationViewModels(edgeAgentTwin.properties.desired); }).toThrow();
        });
    });

    describe('getModuleSpecificationViewModel', () => {
        it('throws exception if module is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.modules.tempSensor = null;
            expect(() => { getModuleSpecificationViewModel(edgeAgentTwin.properties.desired, 'tempSensor'); }).toThrow();
        });

        it('throws exception if restart policy is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.modules.tempSensor.restartPolicy = null;
            expect(() => { getModuleSpecificationViewModel(edgeAgentTwin.properties.desired, 'tempSensor'); }).toThrow();
        });

        it('throws exception if status is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.modules.tempSensor.status = null;
            expect(() => { getModuleSpecificationViewModel(edgeAgentTwin.properties.desired, 'tempSensor'); }).toThrow();
        });
    });

    describe('$EdgeAgentRuntimeSettingsPresent', () => {
        it('returns false when edgeAgentDesiredProoperties is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired = null;
            expect($EdgeAgentRuntimeSettingsPresent(edgeAgentTwin.properties.desired)).toEqual(false);
        });

        it('returns false when edgeAgentDesiredProperties.runtime is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.runtime = null;
            expect($EdgeAgentRuntimeSettingsPresent(edgeAgentTwin.properties.desired)).toEqual(false);
        });

        it('returns false when edgeAgentDesiredProperties.runtime.settings is null ', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.runtime.settings = null;
            expect($EdgeAgentRuntimeSettingsPresent(edgeAgentTwin.properties.desired)).toEqual(false);
        });
    });

    describe('ensure$EdgeAgentRuntime', () => {
        it('throws exception when runtime is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.runtime = null;
            expect(() => { ensure$EdgeAgentRuntime(edgeAgentTwin.properties.desired); }).toThrow();
        });
    });

    describe('ensure$EdgeAgentSystemModules', () => {
        it('throws exception when systemModules is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.systemModules = null;
            expect(() => { ensure$EdgeAgentSystemModules(edgeAgentTwin.properties.desired); }).toThrow();
        });
    });

    describe('get$EdgeAgentSchemaVersion', () => {
        it('throws exception when schemaVersion is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.schemaVersion = null;
            expect(() => { get$EdgeAgentSchemaVersion(edgeAgentTwin.properties.desired); }).toThrow();
        });
    });

    describe('get$EdgeAgentRuntimeType', () => {
        it('throws exception when runtimeType is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.runtime.type = null;
            expect(() => { get$EdgeAgentRuntimeType(edgeAgentTwin.properties.desired); }).toThrow();
        });
    });

    describe('get$EdgeAgentMinDockerVersion', () => {
        it('returns empty string if runtime.settings is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.runtime.settings = null;
            expect(get$EdgeAgentMinDockerVersion(edgeAgentTwin.properties.desired)).toEqual('');
        });

        it('returns empty string if minDockerVersion is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.runtime.settings.minDockerVersion = null;
            expect(get$EdgeAgentMinDockerVersion(edgeAgentTwin.properties.desired)).toEqual('');

        });
    });

    describe('get$EdgeAgentLoggingOptions', () => {
        it('returns empty string if runtime.settings is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.runtime.settings = null;
            expect(get$EdgeAgentLoggingOptions(edgeAgentTwin.properties.desired)).toEqual('');
        });

        it('returns empty string if loggingOptions is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.runtime.settings.loggingOptions = null;
            expect(get$EdgeAgentLoggingOptions(edgeAgentTwin.properties.desired)).toEqual('');
        });
    });

    describe('get$EdgeAgentRegistryCredentials', () => {
        it('returns empty array when if runtime.settings is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.runtime.settings = null;
            expect(get$EdgeAgentRegistryCredentials(edgeAgentTwin.properties.desired).length).toEqual(0);
        });

        it('returns empty array if registryCredentials is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.runtime.settings.registryCredentials = null;
            expect(get$EdgeAgentRegistryCredentials(edgeAgentTwin.properties.desired).length).toEqual(0);
        });

        it('throws exception if registryCredential is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.runtime.settings.registryCredentials.credential1 = null;
            expect(() => { get$EdgeAgentRegistryCredentials(edgeAgentTwin.properties.desired); }).toThrow();
        });

        it('throws exception if address is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.runtime.settings.registryCredentials.credential1.address = null;
            expect(() => { get$EdgeAgentRegistryCredentials(edgeAgentTwin.properties.desired); }).toThrow();
        });

        it('throws exception if username is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.runtime.settings.registryCredentials.credential1.username = null;
            expect(() => { get$EdgeAgentRegistryCredentials(edgeAgentTwin.properties.desired); }).toThrow();
        });

        it('throws exeption is password is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.runtime.settings.registryCredentials.credential1.password = null;
            expect(() => { get$EdgeAgentRegistryCredentials(edgeAgentTwin.properties.desired); }).toThrow();
        });
    });

    describe('getEdgeAgentSpecificationViewModel', () => {
        it('throws exception when edgeAgent is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.systemModules.edgeAgent = null;
            expect(() => { getEdgeAgentSpecificationViewModel(edgeAgentTwin.properties.desired); }).toThrow();
        });
    });

    describe('getEdgeHubSpecificationViewModel', () => {
        it('throws exception when edgeHub is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.systemModules.edgeHub = null;
            expect(() => { getEdgeHubSpecificationViewModel(edgeAgentTwin.properties.desired); }).toThrow();
        });

        it('throws exception when restartPolicy is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.systemModules.edgeHub.restartPolicy = null;
            expect(() => { getEdgeHubSpecificationViewModel(edgeAgentTwin.properties.desired); }).toThrow();
        });

        it('throws exception when status is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.systemModules.edgeHub.status = null;
            expect(() => { getEdgeHubSpecificationViewModel(edgeAgentTwin.properties.desired); }).toThrow();
        });
    });

    describe('getBaseEdgeModuleSpecificationViewModel', () => {
        it('throws exception when type is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.modules.tempSensor.type = null;
            expect(() => { getBaseEdgeModuleSpecificationViewModel(edgeAgentTwin.properties.desired.modules.tempSensor, 'tempSensor'); }).toThrow();
        });

        it('throws exception when type is null for system module', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.systemModules.edgeAgent.type = null;
            expect(() => { getBaseEdgeModuleSpecificationViewModel(edgeAgentTwin.properties.desired.systemModules.edgeAgent, 'edgeAgent', true); }).toThrow();
        });

        it('throws exception when settings is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.modules.tempSensor.settings = null;
            expect(() => { getBaseEdgeModuleSpecificationViewModel(edgeAgentTwin.properties.desired.modules.tempSensor, 'tempSensor'); }).toThrow();
        });

        it('throws exception when settings is null for system module', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.systemModules.edgeAgent.settings = null;
            expect(() => { getBaseEdgeModuleSpecificationViewModel(edgeAgentTwin.properties.desired.systemModules.edgeAgent, 'edgeAgent', true); }).toThrow();
        });

        it('throws exception when image is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.modules.tempSensor.settings.image = null;
            expect(() => { getBaseEdgeModuleSpecificationViewModel(edgeAgentTwin.properties.desired.modules.tempSensor, 'tempSensor'); }).toThrow();
        });

        it('throws exception when image is null for system module', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.systemModules.edgeAgent.settings.image = null;
            expect(() => { getBaseEdgeModuleSpecificationViewModel(edgeAgentTwin.properties.desired.systemModules.edgeAgent, 'edgeAgent', true); }).toThrow();
        });

        it('throws exception when createOptions are malformed', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.modules.tempSensor.settings.createOptions = '{';
            edgeAgentTwin.properties.desired.modules.tempSensor.settings.createOptions01 = ')';

            expect(() => { getBaseEdgeModuleSpecificationViewModel(edgeAgentTwin.properties.desired.modules.tempSensor, 'tempSensor'); }).toThrow();
        });

        it('sets create options to empty string if createOptions is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.modules.tempSensor.settings.createOptions = null;

            expect(getBaseEdgeModuleSpecificationViewModel(edgeAgentTwin.properties.desired.modules.tempSensor, 'tempSensor').createOptions).toEqual('');
        });

        it('throws exception when environment variable is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.modules.tempSensor.env.edgeCustomModuleVar1 = null;
            expect(() => { getBaseEdgeModuleSpecificationViewModel(edgeAgentTwin.properties.desired.modules.tempSensor, 'tempSensor'); }).toThrow();
        });

        it('throws exception when environment variable is null for system module', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.systemModules.edgeAgent.env.edgeAgentVar1 = null;
            expect(() => { getBaseEdgeModuleSpecificationViewModel(edgeAgentTwin.properties.desired.systemModules.edgeAgent, 'edgeAgent', true); }).toThrow();
        });

        it('throws exception when environment variable value is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.modules.tempSensor.env.edgeCustomModuleVar1.value = null;
            expect(() => { getBaseEdgeModuleSpecificationViewModel(edgeAgentTwin.properties.desired.modules.tempSensor, 'tempSensor'); }).toThrow();
        });

        it('throws exception when environment variable value is null for system module', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.systemModules.edgeAgent.env.edgeAgentVar1.value = null;
            expect(() => { getBaseEdgeModuleSpecificationViewModel(edgeAgentTwin.properties.desired.systemModules.edgeAgent, 'edgeAgent', true); }).toThrow();
        });

        it('returns empty array of environment variables when value is null', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            edgeAgentTwin.properties.desired.systemModules.edgeAgent.env = null;
            expect(getBaseEdgeModuleSpecificationViewModel(edgeAgentTwin.properties.desired.systemModules.edgeAgent, 'edgeAgent', true).environmentVariables.length).toEqual(0);
        });
    });
});
