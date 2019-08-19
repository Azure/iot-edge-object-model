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
                routes: {
                    route1: 'route1'
                },
                schemaVersion: 'schemaVersion',
                storeAndForwardTimeToLive: 7200
            };

            const edgeHubDesiredProperties = generate$EdgeHubConfigurationContent(edgeHubDesiredPropertiesViewModel) as $EdgeHubDesiredProperties;
            expect(edgeHubDesiredProperties.routes).toEqual(edgeHubDesiredPropertiesViewModel.routes);
            expect(edgeHubDesiredProperties.schemaVersion).toEqual('1.0');
            expect(edgeHubDesiredProperties.storeAndForwardConfiguration.timeToLiveSecs).toEqual(edgeHubDesiredPropertiesViewModel.storeAndForwardTimeToLive);
        });
    });
});
