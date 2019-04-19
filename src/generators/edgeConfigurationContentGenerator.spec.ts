// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import { generateConfigurationContent, amendEdgeModuleDesiredProperties } from './edgeConfigurationContentGenerator';
import { EdgeConfigurationContentViewModel } from '../viewModel/edgeConfigurationContentViewModel';
import * as $EdgeAgentConfigurationContentGenerator from '../edgeAgent/version1_0/generator/$EdgeAgentConfigurationContentGenerator';
import * as $EdgeHubConfigurationContentGenerator from '../edgeHub/version1_0/generator/$EdgeHubConfigurationContentGenerator';
import { newEdgeModuleSpecificationViewModel  } from '../utilities/testHelpers';
import {
    new$EdgeAgentDesiredPropertiesViewModelWithDefaults,
    new$EdgeHubDesiredPropertiesViewModelWithDefaults,
} from '../utilities/viewModelFactory';

describe('edgeConfigurationContentGenerator', () => {
    describe('generateConfigurationContent', () => {
        it('execute generator functions and returns structure', () => {
            const agentGenerator = jest.spyOn($EdgeAgentConfigurationContentGenerator, 'generate$EdgeAgentConfigurationContent');
            agentGenerator.mockImplementation(() => {
                return {
                    sampleAgent: 'valueAgent'
                };
            });

            const hubGenerator = jest.spyOn($EdgeHubConfigurationContentGenerator, 'generate$EdgeHubConfigurationContent');
            hubGenerator.mockImplementation(() => {
                return {
                    sampleHub: 'valueHub'
                };
            });

            const edgeConfigurationContentViewModel: EdgeConfigurationContentViewModel = {
                $edgeAgentDesiredPropertiesViewModel: new$EdgeAgentDesiredPropertiesViewModelWithDefaults(),
                $edgeHubDesiredPropertiesViewModel: new$EdgeHubDesiredPropertiesViewModelWithDefaults()
            };

            expect(JSON.stringify(generateConfigurationContent(edgeConfigurationContentViewModel))).toEqual(JSON.stringify({
                $edgeAgent: {
                    'properties.desired': {
                        sampleAgent: 'valueAgent'
                    }
                },
                $edgeHub: {
                    'properties.desired': {
                        sampleHub: 'valueHub'
                    }
                }
            }));
        });
    });

    describe('amendEdgeModuleDesiredProperties', () => {
        it('returns with no execution when moduleSpecificationViewModels is null', () => {
            const $edgeAgentDesiredPropertiesViewModel = new$EdgeAgentDesiredPropertiesViewModelWithDefaults();
            $edgeAgentDesiredPropertiesViewModel.moduleSpecificationViewModels = null;

            const edgeConfigurationContent = {};
            amendEdgeModuleDesiredProperties($edgeAgentDesiredPropertiesViewModel, edgeConfigurationContent);
            expect(Object.keys(edgeConfigurationContent).length).toEqual(0);
        });

        it('does not amend dictionary element when desiredProperties is null', () => {
            const $edgeAgentDesiredPropertiesViewModel = new$EdgeAgentDesiredPropertiesViewModelWithDefaults();
            const edgeModuleSpecification = newEdgeModuleSpecificationViewModel();
            $edgeAgentDesiredPropertiesViewModel.moduleSpecificationViewModels = [ edgeModuleSpecification ];

            const edgeConfigurationContent = {};
            amendEdgeModuleDesiredProperties($edgeAgentDesiredPropertiesViewModel, edgeConfigurationContent);
            expect(Object.keys(edgeConfigurationContent).length).toEqual(0);
        });

        it('does not amend dictionary element when desiredProperties is null', () => {
            const $edgeAgentDesiredPropertiesViewModel = new$EdgeAgentDesiredPropertiesViewModelWithDefaults();
            const edgeModuleSpecification = newEdgeModuleSpecificationViewModel();
            edgeModuleSpecification.name = 'module1';
            edgeModuleSpecification.desiredProperties = {
                'properties.desired': {
                    hello: 'world'
                }
            };
            $edgeAgentDesiredPropertiesViewModel.moduleSpecificationViewModels = [ edgeModuleSpecification ];

            const edgeConfigurationContent = {};
            amendEdgeModuleDesiredProperties($edgeAgentDesiredPropertiesViewModel, edgeConfigurationContent);
            expect(Object.keys(edgeConfigurationContent).length).toEqual(1);
            expect(edgeConfigurationContent['module1']['properties.desired'].hello).toEqual('world');
        });
    });
});
