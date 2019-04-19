// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { EdgeModuleReportViewModel } from './edgeModuleReportViewModel';

export interface $EdgeAgentReportedPropertiesViewModel {
    edgeAgentModuleReportViewModel: EdgeModuleReportViewModel | null;
    edgeHubModuleReportViewModel: EdgeModuleReportViewModel | null;
    edgeModuleReportViewModels: EdgeModuleReportViewModel[];
    runtimeResponseCode: number | null;
}
