// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { toEdgeConfigurationContentPatchViewModel } from './edgeConfigurationContentPatchParser';
import { newEdgeModuleSpecificationViewModel } from '../utilities/testHelpers';
import * as EdgeAgentPatchParser from '../edgeAgent/version1_0/parser/$EdgeAgentConfigurationContentPatchParser';
import * as EdgeHubPatchParser from '../edgeHub/version1_0/parser/$EdgeHubConfigurationContentPatchParser';

describe('toEdgeConfigurationContentPatchViewModel', () => {
    it('returns results of getEdgePatchEntries', () => {
        const spy = jest.spyOn(EdgeAgentPatchParser, 'get$EdgeAgentPatchEntries');
        const mockResult = {
            additionalEdgeAgentEntries: [
                { 'properties.desired.foo': 'value'}
            ],
            moduleSpecificationViewModels: [
                newEdgeModuleSpecificationViewModel()
            ],
            registryCredentials: [
                {
                    address: 'address',
                    name: 'name',
                    password: 'password',
                    username: 'username'
                }
            ]
        };

        spy.mockReturnValue(mockResult);
        const parseResult = toEdgeConfigurationContentPatchViewModel({});
        expect(spy).toHaveBeenCalledTimes(1);

        expect(parseResult.additionalEdgeAgentEntries).toHaveLength(1);
        expect(parseResult.additionalEdgeAgentEntries[0]).toEqual(mockResult.additionalEdgeAgentEntries[0]);

        expect(parseResult.moduleSpecificationViewModels).toHaveLength(1);
        expect(parseResult.moduleSpecificationViewModels[0]).toEqual(mockResult.moduleSpecificationViewModels[0]);

        expect(parseResult.registryCredentials).toHaveLength(1);
        expect(parseResult.registryCredentials[0]).toEqual(mockResult.registryCredentials[0]);
    });

    it('returns results of getEdgeHubPatchEntries', () => {
        const spy = jest.spyOn(EdgeHubPatchParser, 'get$EdgeHubPatchEntries');
        const mockResult = {
            additionalEdgeHubEntries: [
                { 'properties.desired.foo': 'value'}
            ],
            routeViewModels: [
                {
                    name: 'path1',
                    value: 'x'
                },
                {
                    name: 'path2',
                    value: 'y'
                }
            ]
        };

        spy.mockReturnValue(mockResult);
        const parseResult = toEdgeConfigurationContentPatchViewModel({});
        expect(spy).toHaveBeenCalledTimes(1);

        expect(parseResult.additionalEdgeHubEntries).toHaveLength(1);
        expect(parseResult.additionalEdgeHubEntries[0]).toEqual(mockResult.additionalEdgeHubEntries[0]);

        expect(parseResult.routeViewModels).toEqual(mockResult.routeViewModels);
    });
});
