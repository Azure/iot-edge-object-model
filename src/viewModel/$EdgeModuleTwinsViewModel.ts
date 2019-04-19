// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeAgentModuleTwinViewModel } from './$EdgeAgentModuleTwinViewModel';
import { $EdgeHubModuleTwinViewModel } from './$EdgeHubModuleTwinViewModel';

export interface $EdgeModuleTwinsViewModel {
    $edgeAgent: $EdgeAgentModuleTwinViewModel | null;
    $edgeHub: $EdgeHubModuleTwinViewModel | null;
}
