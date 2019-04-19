// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeAgentDesiredProperties } from './$EdgeAgentDesiredProperties';
import { $EdgeAgentReportedProperties } from './$EdgeAgentReportedProperties';

export interface $EdgeAgentModuleTwin {
    properties: {
        desired: $EdgeAgentDesiredProperties;
        reported: $EdgeAgentReportedProperties;
    };
}
