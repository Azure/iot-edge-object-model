// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { EdgeModuleSpecificationViewModel } from './edgeModuleSpecificationViewModel';
import { EdgeModuleReportViewModel } from './edgeModuleReportViewModel';

export enum EdgeModuleType {
    systemModule,
    customModule,
}

export interface EdgeModuleViewModel {
    exitCode: string;
    lastStartTimeUtc: Date | null;
    listedOnDevice: boolean;
    listedOnEdgeAgent: boolean;
    reported: EdgeModuleReportViewModel | null;
    desired: EdgeModuleSpecificationViewModel | null;
    name: string;
    runtimeStatus: string;
    moduleType: EdgeModuleType;
    moduleDescription?: string;
    displayName: string;
}
