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
                mqttBroker: `{"bridges": []}`,
                routeViewModels: [
                    {
                        name: 'route1',
                        value: 'route1Value'
                    },
                    {
                        name: 'route2',
                        timeToLiveSecs: 100,
                        value: 'route2Value'
                    },
                    {
                        name: 'route3',
                        priority: 100,
                        value: 'route3Value'
                    }
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
                },
                route3: {
                    priority: 100,
                    route: 'route3Value',
                    timeToLiveSecs: undefined
                }
            });
            expect(edgeHubDesiredProperties.mqttBroker).toEqual({bridges: []});
            expect(edgeHubDesiredProperties.schemaVersion).toEqual('schemaVersion');
            expect(edgeHubDesiredProperties.storeAndForwardConfiguration.timeToLiveSecs).toEqual(edgeHubDesiredPropertiesViewModel.storeAndForwardTimeToLive);
        });
    });
});
