// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeHubDesiredProperties } from './$EdgeHubDesiredProperties';
import { $EdgeHubReportedProperties } from './$EdgeHubReportedProperties';

export interface $EdgeHubModuleTwin {
    properties: {
        desired: $EdgeHubDesiredProperties;
        reported: $EdgeHubReportedProperties;
    };
}
