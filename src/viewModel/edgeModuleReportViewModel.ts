// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { EnvironmentVariableViewModel } from './environmentVariableViewModel';

export interface EdgeModuleReportViewModel {
    name: string;
    version: string;
    type: string;
    status: string;
    lastExitTimeUtc: Date | null;
    lastRestartTimeUtc: Date | null;
    lastStartTimeUtc: Date | null;
    restartCount: number | null;
    restartPolicy: string;
    statusDescription: string;
    image: string;
    exitCode: number | null;
    createOptions: string;
    runtimeStatus: string;
    environmentVariables: EnvironmentVariableViewModel[];
    startUpOrder?: string;
}
