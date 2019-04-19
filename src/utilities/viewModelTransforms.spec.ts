// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import { convertToEdgeConfigurationContentViewModel, convertToEdgeModuleViewModels, getDesiredModules, getEdgeAgentModuleEntry, getEdgeHubModuleEntry } from './viewModelTransforms';
import { new$EdgeAgentDesiredPropertiesViewModelWithDefaults, new$EdgeHubDesiredPropertiesViewModelWithDefaults } from './viewModelFactory';
import { sampleEdgeModuleTwinsViewModel } from './testHelpers';

describe('viewModelTransforms', () => {
    describe('toEdgeConfigurationContentViewModel', () => {
        it('returns newEdgeConfigurationContentViewModelWithDefaults when viewModel is null', () => {
            const expectedResult = {
                $edgeAgentDesiredPropertiesViewModel: new$EdgeAgentDesiredPropertiesViewModelWithDefaults(),
                $edgeHubDesiredPropertiesViewModel: new$EdgeHubDesiredPropertiesViewModelWithDefaults()
            };
            expect(convertToEdgeConfigurationContentViewModel(null)).toEqual(expectedResult);
        });

        it('returns new$EdgeAgentDesiredPropertiesViewModel when viewModel.$edgeAgent is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent = null;

            const expectedResult = {
                $edgeAgentDesiredPropertiesViewModel: new$EdgeAgentDesiredPropertiesViewModelWithDefaults(),
                $edgeHubDesiredPropertiesViewModel: sampleTwinsViewModel.$edgeHub.desiredPropertiesViewModel
            };
            expect(convertToEdgeConfigurationContentViewModel(sampleTwinsViewModel)).toEqual(expectedResult);
        });

        it('returns new$EdgeAgentDesiredPropertiesViewModel when viewModel.$edgeAgent.desiredPropertiesViewModel is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent.desiredPropertiesViewModel = null;

            const expectedResult = {
                $edgeAgentDesiredPropertiesViewModel: new$EdgeAgentDesiredPropertiesViewModelWithDefaults(),
                $edgeHubDesiredPropertiesViewModel: sampleTwinsViewModel.$edgeHub.desiredPropertiesViewModel
            };
            expect(convertToEdgeConfigurationContentViewModel(sampleTwinsViewModel)).toEqual(expectedResult);
        });

        it('returns new$EdgeHubDesiredPropertiesViewModel when viewModel.$edgeHub is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeHub = null;

            const expectedResult = {
                $edgeAgentDesiredPropertiesViewModel: sampleTwinsViewModel.$edgeAgent.desiredPropertiesViewModel,
                $edgeHubDesiredPropertiesViewModel: new$EdgeHubDesiredPropertiesViewModelWithDefaults()
            };
            expect(convertToEdgeConfigurationContentViewModel(sampleTwinsViewModel)).toEqual(expectedResult);
        });

        it('returns new$EdgeHubDesiredPropertiesViewModel when viewModel.$edgeHub.desiredPropertiesViewModel is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeHub.desiredPropertiesViewModel = null;

            const expectedResult = {
                $edgeAgentDesiredPropertiesViewModel: sampleTwinsViewModel.$edgeAgent.desiredPropertiesViewModel,
                $edgeHubDesiredPropertiesViewModel: new$EdgeHubDesiredPropertiesViewModelWithDefaults()
            };
            expect(convertToEdgeConfigurationContentViewModel(sampleTwinsViewModel)).toEqual(expectedResult);
        });

        it('returns edgeAgent and edgeHub Desired Properties view models of twin', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            const result = convertToEdgeConfigurationContentViewModel(sampleTwinsViewModel);
            expect(result.$edgeAgentDesiredPropertiesViewModel).toEqual(sampleTwinsViewModel.$edgeAgent.desiredPropertiesViewModel);
            expect(result.$edgeHubDesiredPropertiesViewModel).toEqual(sampleTwinsViewModel.$edgeHub.desiredPropertiesViewModel);
        });
    });

    describe('convertToEdgeModuleViewModules', () => {
        it('returns list of EdgeModuleViewModels', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            const result = convertToEdgeModuleViewModels(sampleTwinsViewModel);
            expect(result.length).toEqual(4);

            expect(result[0].displayName).toEqual('$edgeAgent');
            expect(result[0].desired).not.toBeNull();
            expect(result[0].exitCode).toEqual('0');
            expect(result[0].lastStartTimeUtc).toBeNull();
            expect(result[0].listedOnDevice).toEqual(true);
            expect(result[0].listedOnEdgeAgent).toEqual(true);
            expect(result[0].name).toEqual('edgeAgent');
            expect(result[0].moduleDescription).toBeUndefined();
            expect(result[0].reported).not.toBeNull();
            expect(result[0].runtimeStatus).toEqual('runtimeStatus');

            expect(result[1].displayName).toEqual('$edgeHub');
            expect(result[1].desired).not.toBeNull();
            expect(result[1].exitCode).toEqual('10');
            expect(result[1].lastStartTimeUtc).toBeNull();
            expect(result[1].listedOnDevice).toEqual(true);
            expect(result[1].listedOnEdgeAgent).toEqual(true);
            expect(result[1].name).toEqual('edgeHub');
            expect(result[1].moduleDescription).toBeUndefined();
            expect(result[1].reported).not.toBeNull();
            expect(result[1].runtimeStatus).toEqual('runtimeStatusHub');

            expect(result[2].displayName).toEqual('notModuleName1');
            expect(result[2].desired).toBeNull();
            expect(result[2].exitCode).toEqual('1');
            expect(result[2].lastStartTimeUtc).toBeNull();
            expect(result[2].listedOnDevice).toEqual(true);
            expect(result[2].listedOnEdgeAgent).toEqual(false);
            expect(result[2].name).toEqual('notModuleName1');
            expect(result[2].moduleDescription).toBeUndefined();
            expect(result[2].reported).not.toBeNull();
            expect(result[2].runtimeStatus).toEqual('runtimeStatusModule');

            expect(result[3].displayName).toEqual('moduleName1');
            expect(result[3].desired).not.toBeNull();
            expect(result[3].exitCode).toEqual('--');
            expect(result[3].lastStartTimeUtc).toBeNull();
            expect(result[3].listedOnDevice).toEqual(false);
            expect(result[3].listedOnEdgeAgent).toEqual(true);
            expect(result[3].name).toEqual('moduleName1');
            expect(result[3].moduleDescription).toBeUndefined();
            expect(result[3].reported).toBeNull();
            expect(result[3].runtimeStatus).toEqual('--');
        });

        it('sets custom module exit code to "--" when exit code is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent.reportedPropertiesViewModel.edgeModuleReportViewModels[0].exitCode = null;

            const result = convertToEdgeModuleViewModels(sampleTwinsViewModel);
            expect(result[2].exitCode).toEqual('--');
        });

        it('sets runtimStatus to "--" when runtimeStatus is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent.reportedPropertiesViewModel.edgeModuleReportViewModels[0].runtimeStatus = null;

            const result = convertToEdgeModuleViewModels(sampleTwinsViewModel);
            expect(result[2].runtimeStatus).toEqual('--');
        });

        it('does not amend edgeAgent when module entry is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent.desiredPropertiesViewModel.edgeAgentModuleSpecificationViewModel = null;
            sampleTwinsViewModel.$edgeAgent.reportedPropertiesViewModel.edgeAgentModuleReportViewModel = null;

            const result = convertToEdgeModuleViewModels(sampleTwinsViewModel);
            expect(result.length).toEqual(2);
        });

        it('does not amend edgeHub when module entry is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent.desiredPropertiesViewModel.edgeHubModuleSpecificationViewModel = null;
            sampleTwinsViewModel.$edgeAgent.reportedPropertiesViewModel.edgeHubModuleReportViewModel = null;

            const result = convertToEdgeModuleViewModels(sampleTwinsViewModel);
            expect(result.length).toEqual(3);
        });

        it('amends information of reported custom module to indicate it is desired', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent.reportedPropertiesViewModel.edgeModuleReportViewModels[0].name = 'moduleName1';

            const result = convertToEdgeModuleViewModels(sampleTwinsViewModel);
            expect(result[2].listedOnEdgeAgent).toEqual(true);
        });
    });

    describe('getDesiredModules', () => {
        it('returns empty array if edgeModuleTwins is null', () => {
            expect(getDesiredModules(null).length).toEqual(0);
        });

        it('returns empty array if edgeModuleTwins.$edgeAgent is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent = null;
            expect(getDesiredModules(sampleTwinsViewModel).length).toEqual(0);
        });

        it('returns empty array if edgeModuleTwins.$edgeAgent.desiredProperties is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent.desiredPropertiesViewModel = null;
            expect(getDesiredModules(sampleTwinsViewModel).length).toEqual(0);
        });

        it('returns empty array of edgeModuleTwins.$edgeAgent.desiredProperties.moduleSpecificationViewModels is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent.desiredPropertiesViewModel.moduleSpecificationViewModels = null;
            expect(getDesiredModules(sampleTwinsViewModel).length).toEqual(0);
        });
    });

    describe('getEdgeAgentModuleEntry', () => {
        it('returns null when edgeModules is null', () => {
            expect(getEdgeAgentModuleEntry(null)).toBeNull();
        });

        it('returns null when edgeModuleTwins.$edgeAgent is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent = null;
            expect(getEdgeAgentModuleEntry(sampleTwinsViewModel)).toBeNull();
        });
        it('returns new edgeAgent module specification when desired properties not set', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent.desiredPropertiesViewModel.edgeAgentModuleSpecificationViewModel = null;

            const result = getEdgeAgentModuleEntry(sampleTwinsViewModel);
            expect(result.desired).toBeNull();
        });

        it('sets exit code to "--" when exit code is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent.reportedPropertiesViewModel.edgeAgentModuleReportViewModel.exitCode = null;

            const result = getEdgeAgentModuleEntry(sampleTwinsViewModel);
            expect(result.exitCode).toEqual('--');
        });

        it('sets lastStartTimeUtc to null when value is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent.reportedPropertiesViewModel.edgeAgentModuleReportViewModel = null;

            const result = getEdgeAgentModuleEntry(sampleTwinsViewModel);
            expect(result.lastStartTimeUtc).toBeNull();
        });

        it('sets runtimeStatus to "--" when exit code is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent.reportedPropertiesViewModel.edgeAgentModuleReportViewModel.runtimeStatus = null;

            const result = getEdgeAgentModuleEntry(sampleTwinsViewModel);
            expect(result.runtimeStatus).toEqual('--');
        });
    });

    describe('getEdgeHubModuleEntry', () => {
        it('returns null when edgeModules is null', () => {
            expect(getEdgeHubModuleEntry(null)).toBeNull();
        });

        it('returns null when edgeModuleTwins.$edgeAgent is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent = null;
            expect(getEdgeHubModuleEntry(sampleTwinsViewModel)).toBeNull();
        });

        it('returns new edgeHub module specification when desired properties not set', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent.desiredPropertiesViewModel.edgeHubModuleSpecificationViewModel = null;

            const result = getEdgeHubModuleEntry(sampleTwinsViewModel);
            expect(result.desired).toBeNull();
        });

        it('sets exit code to "--" when exit code is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent.reportedPropertiesViewModel.edgeHubModuleReportViewModel.exitCode = null;

            const result = getEdgeHubModuleEntry(sampleTwinsViewModel);
            expect(result.exitCode).toEqual('--');
        });

        it('sets lastStartTimeUtc to null when value is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent.reportedPropertiesViewModel.edgeHubModuleReportViewModel = null;

            const result = getEdgeHubModuleEntry(sampleTwinsViewModel);
            expect(result.lastStartTimeUtc).toBeNull();
        });

        it('sets runtimeStatus to "--" when exit code is null', () => {
            const sampleTwinsViewModel = sampleEdgeModuleTwinsViewModel();
            sampleTwinsViewModel.$edgeAgent.reportedPropertiesViewModel.edgeHubModuleReportViewModel.runtimeStatus = null;

            const result = getEdgeHubModuleEntry(sampleTwinsViewModel);
            expect(result.runtimeStatus).toEqual('--');
        });
    });
});
