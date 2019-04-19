// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import * as $EdgeHubDesiredPropertiesParser from './$EdgeHubDesiredPropertiesParser';
import { get$EdgeHubDesiredPropertiesViewModelFromConfiguration } from './$EdgeHubConfigurationContentParser';

describe('$EdgeHubConfigurationContentParser', () => {
    describe('get$EdgeHubDesiredPropertiesViewModelFromConfiguration', () => {
        it('throws exception when $edgeHub not defined', () => {
            const configurationContent = {
                $edgeHub: null
            };
            expect(() => get$EdgeHubDesiredPropertiesViewModelFromConfiguration(configurationContent)).toThrow();
        });

        it('throws exception when properties.desired of $edgeHub not defined', () => {
            const configurationContent = {
                $edgeHub: {
                    'properties.desired': null
                }
            };
            expect(() => get$EdgeHubDesiredPropertiesViewModelFromConfiguration(configurationContent)).toThrow();
        });

        it('returns $EdgeHubDesiredPropertiesViewModel', () => {
            const configurationContent = {
                $edgeHub: {
                    'properties.desired': {
                        schemaVersion: '1.0'
                    }
                }
            };

            const spy = jest.spyOn($EdgeHubDesiredPropertiesParser, 'get$EdgeHubDesiredPropertiesViewModel')
            spy.mockImplementation(() => {});

            expect(get$EdgeHubDesiredPropertiesViewModelFromConfiguration(configurationContent as any)).not.toBeNull();
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });
});