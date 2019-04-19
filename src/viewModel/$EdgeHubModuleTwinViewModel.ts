// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeHubDesiredPropertiesViewModel } from './$EdgeHubDesiredPropertiesViewModel';
import { $EdgeHubReportedPropertiesViewModel } from './$EdgeHubReportedPropertiesViewModel';

export interface $EdgeHubModuleTwinViewModel {
    desiredPropertiesViewModel: $EdgeHubDesiredPropertiesViewModel | null;
    reportedPropertiesViewModel: $EdgeHubReportedPropertiesViewModel | null;
}
