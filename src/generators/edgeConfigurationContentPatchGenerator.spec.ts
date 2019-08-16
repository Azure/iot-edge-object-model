// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { generateConfigurationContentPatch } from './edgeConfigurationContentPatchGenerator';
import * as $EdgeAgentConfigurationContentPatchGenerator from '../edgeAgent/version1_0/generator/$EdgeAgentConfigurationContentPatchGenerator';
import * as $EdgeHubConfigurationContentPatchGenerator from '../edgeHub/version1_0/generator/$EdgeHubConfigurationContentPatchGenerator';
import { newEdgeModuleSpecificationViewModel } from '../utilities/testHelpers';

describe('generateConfigurationContentPatch', () => {
    it('assigns result of v1 generators to respective entries', () => {
        const edgeConfigurationContentPatchViewModel = {
            additionalEdgeAgentEntries: {},
            additionalEdgeHubEntries: {},
            moduleSpecificationViewModels: [],
            registryCredentials: [],
            routePaths: {}
        };

        const agentSpy = jest.spyOn($EdgeAgentConfigurationContentPatchGenerator, 'generate$EdgeAgentConfigurationContentPatch');
        agentSpy.mockReturnValue('agentReturnValue');

        const hubSpy = jest.spyOn($EdgeHubConfigurationContentPatchGenerator, 'generate$EdgeHubConfigurationContentPatch');
        hubSpy.mockReturnValue('hubReturnValue');

        const result = generateConfigurationContentPatch(edgeConfigurationContentPatchViewModel);
        expect(result['$edgeAgent']).toEqual('agentReturnValue'); // tslint:disable-line:no-string-literal
        expect(result['$edgeHub']).toEqual('hubReturnValue'); // tslint:disable-line:no-string-literal
    });

    it('assigns module twin properties if defined', () => {
        const edgeModuleSpecificationViewModel = newEdgeModuleSpecificationViewModel();
        edgeModuleSpecificationViewModel.name = 'helloModule';
        edgeModuleSpecificationViewModel.desiredProperties = {
            'properties.desired.x': 'x',
            'properties.desired.y': 'y'
        };
        const edgeConfigurationContentPatchViewModel = {
            additionalEdgeAgentEntries: {},
            additionalEdgeHubEntries: {},
            moduleSpecificationViewModels: [ edgeModuleSpecificationViewModel ],
            registryCredentials: [],
            routePaths: {}
        };

        const result = generateConfigurationContentPatch(edgeConfigurationContentPatchViewModel);
        expect(result['helloModule']).toEqual(edgeModuleSpecificationViewModel.desiredProperties); // tslint:disable-line:no-string-literal
    });

    it('does not assign falsy module twin properties', () => {
        const edgeModuleSpecificationViewModel = newEdgeModuleSpecificationViewModel();
        edgeModuleSpecificationViewModel.name = 'helloModule';

        const edgeConfigurationContentPatchViewModel = {
            additionalEdgeAgentEntries: {},
            additionalEdgeHubEntries: {},
            moduleSpecificationViewModels: [ edgeModuleSpecificationViewModel ],
            registryCredentials: [],
            routePaths: {}
        };

        const result = generateConfigurationContentPatch(edgeConfigurationContentPatchViewModel);
        expect(result['helloModule']).toBeUndefined(); // tslint:disable-line:no-string-literal
    });
});
