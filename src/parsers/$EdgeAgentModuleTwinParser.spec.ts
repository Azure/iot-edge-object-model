// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import * as $EdgeAgentModuleTwinParser from '../edgeAgent/version1_0/parser/$EdgeAgentModuleTwinParser';
import { sample$EdgeAgentModuleTwin } from '../utilities/testHelpers';
import {
    to$EdgeAgentModuleTwinViewModel,
    get$EdgeAgentDesiredPropertiesViewModel,
    get$EdgeAgentReportedPropertiesViewModel,
    getConfigurationViewModels } from './$EdgeAgentModuleTwinParser';

describe('$EdgeAgentModuleTwinParser', () => {
    describe('to$EdgeAgentModuleTwinViewModel', () => {
        it('returns instance of $EdgeAgentModuleTwinViewModel', () => {
            const input = sample$EdgeAgentModuleTwin();

            const desiredSpy = jest.spyOn($EdgeAgentModuleTwinParser, 'get$EdgeAgentDesiredPropertiesViewModelFromTwin');
            desiredSpy.mockImplementation(() => {});

            const reportedSpy = jest.spyOn($EdgeAgentModuleTwinParser, 'get$EdgeAgentReportedPropertiesViewModelFromTwin');
            reportedSpy.mockImplementation(() => {});

            const result = to$EdgeAgentModuleTwinViewModel(input as any);
            expect(result).not.toBeNull();
        });
    });

    describe('get$EdgeAgentDesiredPropertiesViewModel', () => {
        it('throws exception when schema version is not 1.0.', () => {
            const input = {
                deviceId: 'device1',
                moduleId: '$edgeAgent',
                properties: {
                    desired: {
                        schemaVersion: '2.0'
                    }
                }
            };

            expect(() => get$EdgeAgentDesiredPropertiesViewModel(input as any)).toThrow();
        });

        it('returns null when schema is not defined', () => {
            const input = {
                deviceId: 'device1',
                moduleId: '$edgeAgent',
                properties: {
                    desired: {
                    }
                }
            };

            expect(get$EdgeAgentDesiredPropertiesViewModel(input as any)).toBeNull();
        });
    });

    describe('get$EdgeAGentReportedPropertiesViewModel', () => {
        it('throws exception when schema version is not 1.0.', () => {
            const input = {
                deviceId: 'device1',
                moduleId: '$edgeAgent',
                properties: {
                    reported: {
                        schemaVersion: '2.0'
                    }
                }
            };

            expect(() => get$EdgeAgentReportedPropertiesViewModel(input as any)).toThrow();
        });

        it('returns null when schema is not defined', () => {
            const input = {
                deviceId: 'device1',
                moduleId: '$edgeAgent',
                properties: {
                    reported: {
                    }
                }
            };

            expect(get$EdgeAgentReportedPropertiesViewModel(input as any)).toBeNull();
        });
    });

    describe('getConfigurationViewModels', () => {
        it('returns configuration view models', () => {
            const input = sample$EdgeAgentModuleTwin();
            const result = getConfigurationViewModels(input);
            expect(result.length).toEqual(1);
            expect(result[0].name).toEqual('myConfiguration');
            expect(result[0].status).toEqual('Applied');
        });

        it('returns empty array if configurations is null or undefined', () => {
            const input = sample$EdgeAgentModuleTwin();
            input.configurations = undefined;

            const result = getConfigurationViewModels(input);
            expect(result.length).toEqual(0);
        });
    });
});
