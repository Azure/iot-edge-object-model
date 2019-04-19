// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeAgentModuleTwin } from '../model/$EdgeAgentModuleTwin';
import { $EdgeAgentDesiredPropertiesViewModel } from '../../../viewModel/$EdgeAgentDesiredPropertiesViewModel';
import { $EdgeAgentReportedPropertiesViewModel } from '../../../viewModel/$EdgeAgentReportedPropertiesViewModel';
import { get$EdgeAgentReportedPropertiesViewModel } from './$EdgeAgentReportedPropertiesParser';
import { get$EdgeAgentDesiredPropertiesViewModel } from './$EdgeAgentDesiredPropertiesParser';
import { EdgeParseException } from '../../../errors/edgeParseException';
import { PATHS } from '../../../utilities/constants';

export const get$EdgeAgentDesiredPropertiesViewModelFromTwin = (edgeAgentModuleTwin: $EdgeAgentModuleTwin): $EdgeAgentDesiredPropertiesViewModel => {
    if (!edgeAgentModuleTwin.properties ||
        !edgeAgentModuleTwin.properties.desired) {
        throw new EdgeParseException([
            PATHS.PROPERTIES,
            PATHS.DESIRED].join('.'));
    }

    return get$EdgeAgentDesiredPropertiesViewModel(edgeAgentModuleTwin.properties.desired);
};

export const get$EdgeAgentReportedPropertiesViewModelFromTwin = (edgeAgentModuleTwin: $EdgeAgentModuleTwin): $EdgeAgentReportedPropertiesViewModel | null  => {
    if (!edgeAgentModuleTwin.properties ||
        !edgeAgentModuleTwin.properties.reported) {
        return null;
    }

    return get$EdgeAgentReportedPropertiesViewModel(edgeAgentModuleTwin.properties.reported);
};
