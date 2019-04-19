// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeAgentDesiredPropertiesViewModel } from './$EdgeAgentDesiredPropertiesViewModel';
import { $EdgeHubDesiredPropertiesViewModel } from './$EdgeHubDesiredPropertiesViewModel';

export interface EdgeConfigurationContentViewModel {
    $edgeAgentDesiredPropertiesViewModel: $EdgeAgentDesiredPropertiesViewModel;
    $edgeHubDesiredPropertiesViewModel: $EdgeHubDesiredPropertiesViewModel;
}
