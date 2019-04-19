// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeHubDesiredProperties } from './$EdgeHubDesiredProperties';

export interface $EdgeHubConfigurationContent {
    $edgeHub: {
        'properties.desired': $EdgeHubDesiredProperties;
    };
}
