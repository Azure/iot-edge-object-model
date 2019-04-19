// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeHubDesiredPropertiesViewModel } from '../../../viewModel/$EdgeHubDesiredPropertiesViewModel';
import { $EdgeHubDesiredProperties } from '../model/$EdgeHubDesiredProperties';
import { $EDGE_HUB } from '../../../utilities/constants';

export const generate$EdgeHubConfigurationContent = (edgeHubDesiredPropertiesViewModel: $EdgeHubDesiredPropertiesViewModel): object => {
    const edgeHubDesiredProperties: $EdgeHubDesiredProperties = {
        routes: edgeHubDesiredPropertiesViewModel.routes,
        schemaVersion: $EDGE_HUB.SCHEMA_VERSION_1_0,
        storeAndForwardConfiguration: {
            timeToLiveSecs: edgeHubDesiredPropertiesViewModel.storeAndForwardTimeToLive
        }
    };

    return edgeHubDesiredProperties;
};
