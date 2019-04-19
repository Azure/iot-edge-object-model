// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeHubConfigurationContent } from '../model/$EdgeHubConfigurationContent';
import { $EdgeHubDesiredPropertiesViewModel } from '../../../viewModel/$EdgeHubDesiredPropertiesViewModel';
import { get$EdgeHubDesiredPropertiesViewModel } from './$EdgeHubDesiredPropertiesParser';
import { EdgeParseException } from '../../../errors/edgeParseException';
import { PATHS } from '../../../utilities/constants';

export const get$EdgeHubDesiredPropertiesViewModelFromConfiguration = (edgeConfigurationContent: $EdgeHubConfigurationContent): $EdgeHubDesiredPropertiesViewModel => {
    ensure$EdgeHub(edgeConfigurationContent);
    ensure$EdgeHubDesiredProperties(edgeConfigurationContent);

    const edgeHubDesiredPropertiesViewModel = get$EdgeHubDesiredPropertiesViewModel(edgeConfigurationContent.$edgeHub['properties.desired']);
    return edgeHubDesiredPropertiesViewModel;
};

export const ensure$EdgeHub = (edgeConfigurationContent: $EdgeHubConfigurationContent) => {
    if (!edgeConfigurationContent.$edgeHub) {
        throw new EdgeParseException(PATHS.$EDGE_HUB);
    }
};

export const ensure$EdgeHubDesiredProperties = (edgeConfigurationContent: $EdgeHubConfigurationContent) => {
    if (!edgeConfigurationContent.$edgeHub['properties.desired']) {
        throw new EdgeParseException([
            PATHS.$EDGE_HUB,
            PATHS.DESIRED_PROPERTIES].join('.'));
    }
};
