// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { get$EdgeHubDesiredPropertiesViewModelFromTwin, get$EdgeHubReportedPropertiesViewModelFromTwin } from '../edgeHub/version1_0/parser/$EdgeHubModuleTwinParser';
import { $EdgeHubModuleTwinViewModel } from '../viewModel/$EdgeHubModuleTwinViewModel';
import { $EdgeHubDesiredPropertiesViewModel } from '../viewModel/$EdgeHubDesiredPropertiesViewModel';
import { $EdgeHubReportedPropertiesViewModel } from '../viewModel/$EdgeHubReportedPropertiesViewModel';
import { EdgeUnsupportedSchemaException } from '../errors/edgeUnsupportedSchemaException';

export interface $EdgeHubModuleTwin {
    moduleId: string;
    deviceId: string;
    properties: {
        desired: {
            schemaVersion: string;
        },
        reported?: {
            schemaVersion: string;
        }
    };
}

export const to$EdgeHubModuleTwinViewModel = (edgeHubModuleTwin: $EdgeHubModuleTwin): $EdgeHubModuleTwinViewModel => {
    const edgeHubModuleTwinViewModel = {
        desiredPropertiesViewModel: get$EdgeHubDesiredPropertiesViewModel(edgeHubModuleTwin),
        reportedPropertiesViewModel: get$EdgeHubReportedPropertiesViewModel(edgeHubModuleTwin)
    };

    return edgeHubModuleTwinViewModel;
};

export const get$EdgeHubDesiredPropertiesViewModel = (edgeHubModuleTwin: $EdgeHubModuleTwin): $EdgeHubDesiredPropertiesViewModel | null => {
    if (!edgeHubModuleTwin.properties ||
        !edgeHubModuleTwin.properties.desired ||
        !edgeHubModuleTwin.properties.desired.schemaVersion) {
            return null;
    }

    const schemaVersion = edgeHubModuleTwin.properties.desired.schemaVersion;
    if (schemaVersion === '1.0') {
        // tslint:disable-next-line:no-any
        return get$EdgeHubDesiredPropertiesViewModelFromTwin(edgeHubModuleTwin as any);
    }
    else {
        throw new EdgeUnsupportedSchemaException(schemaVersion);
    }
};

export const get$EdgeHubReportedPropertiesViewModel = (edgeHubModuleTwin: $EdgeHubModuleTwin): $EdgeHubReportedPropertiesViewModel | null => {
    if (!edgeHubModuleTwin.properties ||
        !edgeHubModuleTwin.properties.reported ||
        !edgeHubModuleTwin.properties.reported.schemaVersion) {
            return null;
    }

    const schemaVersion = edgeHubModuleTwin.properties.reported.schemaVersion;
    if (schemaVersion === '1.0') {
        // tslint:disable-next-line:no-any
        return get$EdgeHubReportedPropertiesViewModelFromTwin(edgeHubModuleTwin as any);
    }
    else {
        throw new EdgeUnsupportedSchemaException(schemaVersion);
    }
};
