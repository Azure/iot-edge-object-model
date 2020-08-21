// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import { sample$EdgeAgentModuleTwin } from '../../../utilities/testHelpers';
import {
    get$EdgeAgentReportedPropertiesViewModel,
    getRuntimeResponseCode,
    getModuleReportViewModels,
    getEdgeAgentModuleReportViewModel,
    getEdgeHubModuleReportViewModel,
    getEdgeModuleReportViewModel
} from './$EdgeAgentReportedPropertiesParser';

describe('$EdgeAgentReportedPropertiesParser', () => {
    describe('get$EdgeAgentReportedPropertiesViewModel', () => {
        it('returns view model meeting specifications', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            const reportedProperties = edgeAgentTwin.properties.reported;
            const result = get$EdgeAgentReportedPropertiesViewModel(reportedProperties as any);

            expect(result.edgeAgentModuleReportViewModel).not.toBeNull();
            expect(result.edgeAgentModuleReportViewModel.createOptions).toEqual('{}');
            expect(result.edgeAgentModuleReportViewModel.exitCode).toBeNull();
            expect(result.edgeAgentModuleReportViewModel.image).toEqual('mcr/azureiotedge-agent:1.0-preview')
            expect(result.edgeAgentModuleReportViewModel.lastExitTimeUtc).toBeNull();
            expect(result.edgeAgentModuleReportViewModel.lastRestartTimeUtc).toBeNull();
            expect(result.edgeAgentModuleReportViewModel.lastStartTimeUtc).toBeInstanceOf(Date);
            expect(result.edgeAgentModuleReportViewModel.name).toEqual('edgeAgent');
            expect(result.edgeAgentModuleReportViewModel.restartCount).toBeNull();
            expect(result.edgeAgentModuleReportViewModel.restartPolicy).toEqual('');
            expect(result.edgeAgentModuleReportViewModel.runtimeStatus).toEqual('running');
            expect(result.edgeAgentModuleReportViewModel.statusDescription).toEqual('');
            expect(result.edgeAgentModuleReportViewModel.type).toEqual('docker');
            expect(result.edgeAgentModuleReportViewModel.version).toEqual('');
            expect(result.edgeAgentModuleReportViewModel.environmentVariables).not.toBeNull();
            expect(result.edgeAgentModuleReportViewModel.environmentVariables.length).toEqual(0);

            expect(result.edgeHubModuleReportViewModel).not.toBeNull();
            expect(result.edgeHubModuleReportViewModel.createOptions).toEqual(JSON.stringify({ Env: 'value'}));
            expect(result.edgeHubModuleReportViewModel.exitCode).toBeNull();
            expect(result.edgeHubModuleReportViewModel.image).toEqual('mcr/azureiotedge-hub:1.0-preview1');
            expect(result.edgeHubModuleReportViewModel.lastExitTimeUtc).toBeNull();
            expect(result.edgeHubModuleReportViewModel.lastRestartTimeUtc).toBeNull();
            expect(result.edgeHubModuleReportViewModel.lastStartTimeUtc).toBeNull();
            expect(result.edgeHubModuleReportViewModel.name).toEqual('edgeHub');
            expect(result.edgeHubModuleReportViewModel.restartCount).toBeNull();
            expect(result.edgeHubModuleReportViewModel.restartPolicy).toEqual('always');
            expect(result.edgeHubModuleReportViewModel.runtimeStatus).toEqual('');
            expect(result.edgeHubModuleReportViewModel.statusDescription).toEqual('created');
            expect(result.edgeHubModuleReportViewModel.type).toEqual('docker');
            expect(result.edgeHubModuleReportViewModel.environmentVariables).not.toBeNull();
            expect(result.edgeHubModuleReportViewModel.environmentVariables.length).toEqual(0);
            expect(result.edgeHubModuleReportViewModel.version).toEqual('');
            expect(result.edgeHubModuleReportViewModel.startUpOrder).toBeUndefined();

            expect(result.edgeModuleReportViewModels.length).toEqual(1);
            expect(result.edgeModuleReportViewModels[0].createOptions).toEqual('{}');
            expect(result.edgeModuleReportViewModels[0].exitCode).toEqual(139);
            expect(result.edgeModuleReportViewModels[0].image).toEqual('mcr/azureiotedge-simulated-temperature-sensor:1.0-preview')
            expect(result.edgeModuleReportViewModels[0].lastExitTimeUtc).toBeInstanceOf(Date);
            expect(result.edgeModuleReportViewModels[0].lastRestartTimeUtc).toBeInstanceOf(Date);
            expect(result.edgeModuleReportViewModels[0].lastStartTimeUtc).toBeInstanceOf(Date);
            expect(result.edgeModuleReportViewModels[0].name).toEqual('tempSensor');
            expect(result.edgeModuleReportViewModels[0].restartCount).toEqual(0);
            expect(result.edgeModuleReportViewModels[0].restartPolicy).toEqual('always');
            expect(result.edgeModuleReportViewModels[0].statusDescription).toEqual('exited');
            expect(result.edgeModuleReportViewModels[0].runtimeStatus).toEqual('failed');
            expect(result.edgeModuleReportViewModels[0].type).toEqual('docker');
            expect(result.edgeModuleReportViewModels[0].version).toEqual('1.0');
            expect(result.edgeModuleReportViewModels[0].startUpOrder).toEqual('1');
            expect(result.edgeModuleReportViewModels[0].environmentVariables).not.toBeNull();
            expect(result.edgeModuleReportViewModels[0].environmentVariables.length).toEqual(1);
            expect(result.edgeModuleReportViewModels[0].environmentVariables[0].name).toEqual('mySetting');
            expect(result.edgeModuleReportViewModels[0].environmentVariables[0].value).toEqual('mySettingValue');
        });
    });

    describe('getRuntimeResponseCode', () => {
        it('returns null when lastDesiredStatus not defined', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            const reportedProperties = edgeAgentTwin.properties.reported;
            reportedProperties.lastDesiredStatus = undefined;
            expect(getRuntimeResponseCode(reportedProperties as any)).toBeNull();
        });

        it('returns null when lastDesidredStatus.code not defined', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            const reportedProperties = edgeAgentTwin.properties.reported;
            reportedProperties.lastDesiredStatus.code = undefined;
            expect(getRuntimeResponseCode(reportedProperties as any)).toBeNull();
        });
    });

    describe('getModuleReportViewModels', () => {
        it('returns empty array when no modules not defined', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            const reportedProperties = edgeAgentTwin.properties.reported;
            reportedProperties.modules = undefined;
            expect(getModuleReportViewModels(reportedProperties as any).length).toEqual(0);
        });
    });

    describe('getEdgeAgentModuleReportViewModel', () => {
        it('returns null when systemModules is not defined', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            const reportedProperties = edgeAgentTwin.properties.reported;
            reportedProperties.systemModules = undefined;
            expect(getEdgeAgentModuleReportViewModel(reportedProperties as any)).toBeNull();
        });

        it('returns null when systemModules.edgeAgent is not defined', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            const reportedProperties = edgeAgentTwin.properties.reported;
            reportedProperties.systemModules.edgeAgent = undefined;
            expect(getEdgeAgentModuleReportViewModel(reportedProperties as any)).toBeNull();
        })
    });

    describe('getEdgeHubModuleReportViewModel', () => {
        it('returns null when systemModules is not defined', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            const reportedProperties = edgeAgentTwin.properties.reported;
            reportedProperties.systemModules = undefined;
            expect(getEdgeHubModuleReportViewModel(reportedProperties as any)).toBeNull();
        });

        it('returns null when systemModules.edgeAgent is not defined', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            const reportedProperties = edgeAgentTwin.properties.reported;
            reportedProperties.systemModules.edgeHub = undefined;
            expect(getEdgeHubModuleReportViewModel(reportedProperties as any)).toBeNull();
        })
    });

    describe('getEdgeModuleReportViewer', () => {
        it('does not apply settngs when reported properties do not specify settings', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            const reportedProperties = edgeAgentTwin.properties.reported;
            reportedProperties.modules.tempSensor.settings = undefined;

            const result = getEdgeModuleReportViewModel(reportedProperties.modules.tempSensor as any, 'tempSensor');
            expect(result.createOptions).toEqual('');
            expect(result.image).toEqual('');
        });

        it('does not apply createOptions when settings.createOptions is not defined', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            const reportedProperties = edgeAgentTwin.properties.reported;
            reportedProperties.modules.tempSensor.settings.createOptions = undefined;

            const result = getEdgeModuleReportViewModel(reportedProperties.modules.tempSensor as any, 'tempSensor');
            expect(result.createOptions).toEqual('');
        });

        it('does not apply image when settings.createOptions is not defined', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            const reportedProperties = edgeAgentTwin.properties.reported;
            reportedProperties.modules.tempSensor.settings.image = undefined;

            const result = getEdgeModuleReportViewModel(reportedProperties.modules.tempSensor as any, 'tempSensor');
            expect(result.image).toEqual('');
        });

        it('does not apply type if undefined', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            const reportedProperties = edgeAgentTwin.properties.reported;
            reportedProperties.modules.tempSensor.type = undefined;

            const result = getEdgeModuleReportViewModel(reportedProperties.modules.tempSensor as any, 'tempSensor');
            expect(result.type).toEqual('');
        });

        it('does not amend env variable with null value', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            const reportedProperties = edgeAgentTwin.properties.reported;
            reportedProperties.modules.tempSensor.env.mySetting = undefined;

            const result = getEdgeModuleReportViewModel(reportedProperties.modules.tempSensor as any, 'tempSensor');
            expect(result.environmentVariables.length).toEqual(0);
        });

        it('does not amend env variable with undefined setting', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            const reportedProperties = edgeAgentTwin.properties.reported;
            reportedProperties.modules.tempSensor.env.mySetting.value = undefined;

            const result = getEdgeModuleReportViewModel(reportedProperties.modules.tempSensor as any, 'tempSensor');
            expect(result.environmentVariables.length).toEqual(0);
        });

        it('does not amend env variable with null setting', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            const reportedProperties = edgeAgentTwin.properties.reported;
            reportedProperties.modules.tempSensor.env.mySetting.value = null;

            const result = getEdgeModuleReportViewModel(reportedProperties.modules.tempSensor as any, 'tempSensor');
            expect(result.environmentVariables.length).toEqual(0);
        });

        it('amends env variable with "" setting', () => {
            const edgeAgentTwin = sample$EdgeAgentModuleTwin();
            const reportedProperties = edgeAgentTwin.properties.reported;
            reportedProperties.modules.tempSensor.env.mySetting.value = '';

            const result = getEdgeModuleReportViewModel(reportedProperties.modules.tempSensor as any, 'tempSensor');
            expect(result.environmentVariables.length).toEqual(1);
        });
    });
});
