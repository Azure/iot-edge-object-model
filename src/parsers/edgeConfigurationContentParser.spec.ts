// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import * as $EdgeAgentConfigurationContentParser from '../edgeAgent/version1_0/parser/$EdgeAgentConfigurationContentParser';
import * as $EdgeHubConfigurationContentParser from '../edgeHub/version1_0/parser/$EdgeHubConfigurationContentParser';
import { toEdgeConfigurationContentViewModel, get$EdgeAgentDesiredPropertiesViewModel, get$EdgeHubDesiredPropertiesViewModel } from './edgeConfigurationContentParser';

describe('edgeConfigurationContentParser', () => {
    describe('toEdgeConfigurationContentViewModel', () => {
        it('returns configurationViewModel', () => {
            const input = {
                $edgeAgent: {
                    'properties.desired': {
                        schemaVersion: '1.0'
                    }
                },
                $edgeHub: {
                    'properties.desired': {
                        schemaVersion: '1.0'
                    }
                }
            };

            const agentSpy = jest.spyOn($EdgeAgentConfigurationContentParser, 'get$EdgeAgentDesiredPropertiesViewModelFromConfiguration');
            agentSpy.mockImplementation(() => {
                return {};
            });

            const hubSpy = jest.spyOn($EdgeHubConfigurationContentParser, 'get$EdgeHubDesiredPropertiesViewModelFromConfiguration');
            hubSpy.mockImplementation(() => {
                return {};
            });

            expect(toEdgeConfigurationContentViewModel(input)).not.toBeNull();
            expect(agentSpy).toBeCalledTimes(1);
            expect(hubSpy).toBeCalledTimes(1);
        });
    });

    describe('getEdgeAgentDesiredPropertiesViewModel', () => {
        it('throws exception when properties.desired of $EdgeAgent not defined', () => {
            const input = {
                $edgeAgent: {
                    'properties.desired': null
                },
            };

            expect(() => get$EdgeAgentDesiredPropertiesViewModel(input)).toThrow();
        });
        it('throws exception when schema version is not supported', () => {
            const input = {
                $edgeAgent: {
                    'properties.desired': {
                        schemaVersion: '2.0'
                    }
                },
            };

            expect(() => get$EdgeAgentDesiredPropertiesViewModel(input)).toThrow();
        });
    });

    describe('getEdgeHubDesiredPropertiesViewModel', () => {
        it('throws exception when properties.desired of $EdgeHub not defined', () => {
            const input = {
                $edgeHub: {
                    'properties.desired': null
                },
            };

            expect(() => get$EdgeHubDesiredPropertiesViewModel(input)).toThrow();
        });
        it('throws exception when schema version is not supported', () => {
            const input = {
                $edgeHub: {
                    'properties.desired': {
                        schemaVersion: '2.0'
                    }
                },
            };

            expect(() => get$EdgeHubDesiredPropertiesViewModel(input)).toThrow();
        });
    });
});