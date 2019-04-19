// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import * as $EdgeHubModuleTwinParser from '../edgeHub/version1_0/parser/$EdgeHubModuleTwinParser';
import {
    to$EdgeHubModuleTwinViewModel,
    get$EdgeHubDesiredPropertiesViewModel,
    get$EdgeHubReportedPropertiesViewModel,
} from './$EdgeHubModuleTwinParser';

describe('$EdgeHubModuleTwinParser', () => {
    describe('to$EdgeHubModuleTwinViewModel', () => {
        it('returns instance of $EdgeHubModuleTwinViewModel', () => {
            const input = {
                properties: {
                    desired: {
                        schemaVersion: '1.0'
                    },
                    reported: {
                        schemaVersion: '1.0'
                    }
                }
            };

            const desiredSpy = jest.spyOn($EdgeHubModuleTwinParser, 'get$EdgeHubDesiredPropertiesViewModelFromTwin');
            desiredSpy.mockImplementation(() => {});

            const reportedSpy = jest.spyOn($EdgeHubModuleTwinParser, 'get$EdgeHubReportedPropertiesViewModelFromTwin');
            reportedSpy.mockImplementation(() => {});

            const result = to$EdgeHubModuleTwinViewModel(input as any);
            expect(result).not.toBeNull();
        });
    });

    describe('get$EdgeHubDesiredPropertiesViewModel', () => {
        it('throws exception when schema version is not 1.0.', () => {
            const input = {
                deviceId: 'device1',
                moduleId: '$edgeHub',
                properties: {
                    desired: {
                        schemaVersion: '2.0'
                    }
                }
            };

            expect(() => get$EdgeHubDesiredPropertiesViewModel(input as any)).toThrow();
        });

        it('returns null when schema is not defined', () => {
            const input = {
                deviceId: 'device1',
                moduleId: '$edgeHub',
                properties: {
                    desired: {
                    }
                }
            };

            expect(get$EdgeHubDesiredPropertiesViewModel(input as any)).toBeNull();
        });
    });

    describe('get$EdgeHubReportedPropertiesViewModel', () => {
        it('throws exception when schema version is not 1.0.', () => {
            const input = {
                deviceId: 'device1',
                moduleId: '$edgeHub',
                properties: {
                    reported: {
                        schemaVersion: '2.0'
                    }
                }
            };

            expect(() => get$EdgeHubReportedPropertiesViewModel(input as any)).toThrow();
        });

        it('returns new null when schema is not defined', () => {
            const input = {
                deviceId: 'device1',
                moduleId: '$edgeHub',
                properties: {
                    reported: {
                    }
                }
            };

            expect(get$EdgeHubReportedPropertiesViewModel(input as any)).toBeNull();
        });
    });
});
