// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { EnvironmentVariable } from './environmentVariable';
import { StringMap } from '../../../utilities/stringMap';

export interface EdgeModuleReport {
    exitCode: number;
    lastExitTimeUtc?: Date;
    lastRestartTimeUtc?: Date;
    lastStartTimeUtc?: Date;
    restartCount?: number;
    restartPolicy?: string;
    runtimeStatus?: string;
    type?: string;
    startupOrder?: number;
    status?: string;
    statusDescription?: string;
    settings?: {
        image?: string,
        createOptions?: string
    };
    version?: string;
    env?: StringMap<EnvironmentVariable>;
}
