// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeAgentDesiredProperties } from './$EdgeAgentDesiredProperties';

export interface $EdgeAgentConfigurationContent {
    $edgeAgent: {
        'properties.desired': $EdgeAgentDesiredProperties;
    };
}
