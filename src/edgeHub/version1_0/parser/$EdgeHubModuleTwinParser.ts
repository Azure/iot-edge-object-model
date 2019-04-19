// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeHubModuleTwin } from '../model/$EdgeHubModuleTwin';
import { get$EdgeHubDesiredPropertiesViewModel } from './$EdgeHubDesiredPropertiesParser';
import { get$EdgeHubReportedPropertiesViewModel } from './$EdgeHubReportedPropertiesParser';
import { $EdgeHubReportedPropertiesViewModel } from '../../../viewModel/$EdgeHubReportedPropertiesViewModel';
import { $EdgeHubDesiredPropertiesViewModel } from '../../../viewModel/$EdgeHubDesiredPropertiesViewModel';
import { EdgeParseException } from '../../../errors/edgeParseException';
import { PATHS } from '../../../utilities/constants';

export const get$EdgeHubDesiredPropertiesViewModelFromTwin = (edgeHubModuleTwin: $EdgeHubModuleTwin): $EdgeHubDesiredPropertiesViewModel => {
    if (!edgeHubModuleTwin.properties) {
        throw new EdgeParseException(PATHS.PROPERTIES);
    }

    if (!edgeHubModuleTwin.properties.desired) {
        throw new EdgeParseException([
            PATHS.PROPERTIES,
            PATHS.DESIRED].join('.'));
    }

    const edgeHubDesiredPropertiesViewModel = get$EdgeHubDesiredPropertiesViewModel(edgeHubModuleTwin.properties.desired);
    return edgeHubDesiredPropertiesViewModel;
};

export const get$EdgeHubReportedPropertiesViewModelFromTwin = (edgeHubModuleTwin: $EdgeHubModuleTwin): $EdgeHubReportedPropertiesViewModel => {
    const edgeHubReportedPropertiesViewModel = get$EdgeHubReportedPropertiesViewModel(edgeHubModuleTwin.properties.reported);
    return edgeHubReportedPropertiesViewModel;
};
