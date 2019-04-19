// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { EdgeModuleReport } from './edgeModuleReport';
import { StringMap } from '../../../utilities/stringMap';

export interface $EdgeAgentReportedProperties {
    schemaVersion: string;
    lastDesiredStatus: {
        code: number;
    };
    systemModules?: {
        edgeAgent?: EdgeModuleReport,
        edgeHub?: EdgeModuleReport
    };
    modules?: StringMap<EdgeModuleReport>;
}
