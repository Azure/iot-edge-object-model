// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import { generate$EdgeHubConfigurationContent } from './$EdgeHubConfigurationContentGenerator';
import { $EdgeHubDesiredPropertiesViewModel } from '../../../viewModel/$EdgeHubDesiredPropertiesViewModel';
import { $EdgeHubDesiredProperties } from '../model/$EdgeHubDesiredProperties';

describe('$EdgeHubConfigurationContentGenerator', () => {
    describe('generate$EdgeHubConfigurationContent', () => {
        it ('generates hub configuration content', () => {
            const edgeHubDesiredPropertiesViewModel: $EdgeHubDesiredPropertiesViewModel = {
                routeViewModels: [
                    {
                        name: 'route1',
                        value: 'route1Value'
                    },
                    {
                        name: 'route2',
                        routeOptions: {
                            timeToLiveSecs: 100
                        },
                        value: 'route2Value'
                    },
                ],
                schemaVersion: 'schemaVersion',
                storeAndForwardTimeToLive: 7200
            };

            const edgeHubDesiredProperties = generate$EdgeHubConfigurationContent(edgeHubDesiredPropertiesViewModel) as $EdgeHubDesiredProperties;
            expect(edgeHubDesiredProperties.routes).toEqual({
                route1: 'route1Value',
                route2: {
                    priority: undefined,
                    route: 'route2Value',
                    timeToLiveSecs: 100,
                }
            });
            expect(edgeHubDesiredProperties.schemaVersion).toEqual('schemaVersion');
            expect(edgeHubDesiredProperties.storeAndForwardConfiguration.timeToLiveSecs).toEqual(edgeHubDesiredPropertiesViewModel.storeAndForwardTimeToLive);
        });
    });
});
