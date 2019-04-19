// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { EdgeModuleSettings } from './edgeModuleSettings';
import { EnvironmentVariable } from './environmentVariable';
import { StringMap } from '../../../utilities/stringMap';

export interface BaseEdgeModuleSpecification {
    version?: string;
    type: string;
    env?: StringMap<EnvironmentVariable>;
    settings: EdgeModuleSettings;
}
