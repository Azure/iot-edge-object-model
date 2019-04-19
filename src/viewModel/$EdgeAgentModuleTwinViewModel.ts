// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeAgentDesiredPropertiesViewModel } from './$EdgeAgentDesiredPropertiesViewModel';
import { $EdgeAgentReportedPropertiesViewModel } from './$EdgeAgentReportedPropertiesViewModel';
import { ConfigurationViewModel } from './configurationViewModel';

export interface $EdgeAgentModuleTwinViewModel {
    desiredPropertiesViewModel: $EdgeAgentDesiredPropertiesViewModel | null;
    reportedPropertiesViewModel: $EdgeAgentReportedPropertiesViewModel | null;
    configurations: ConfigurationViewModel[];
}
