// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeHubDesiredPropertiesViewModel } from '../../../viewModel/$EdgeHubDesiredPropertiesViewModel';
import { $EdgeHubDesiredProperties } from '../model/$EdgeHubDesiredProperties';
import { RouteViewModel } from '../../../viewModel/routeViewModel';

export const generate$EdgeHubConfigurationContent = (edgeHubDesiredPropertiesViewModel: $EdgeHubDesiredPropertiesViewModel): object => {
    const edgeHubDesiredProperties: $EdgeHubDesiredProperties = {
        routes: generateRoutesObject(edgeHubDesiredPropertiesViewModel.routeViewModels),
        schemaVersion: edgeHubDesiredPropertiesViewModel.schemaVersion,
        storeAndForwardConfiguration: {
            timeToLiveSecs: edgeHubDesiredPropertiesViewModel.storeAndForwardTimeToLive
        }
    };

    return edgeHubDesiredProperties;
};

export const generateRoutesObject = (routeViewModels: RouteViewModel[]): object => {
    const routes = {};
    routeViewModels.forEach(routeViewModel => {
        const routeValue = (routeViewModel.priority !== undefined || routeViewModel.timeToLiveSecs !== undefined) ? {
            priority: routeViewModel.priority,
            route: routeViewModel.value,
            timeToLiveSecs: routeViewModel.timeToLiveSecs,
        } : routeViewModel.value;

        routes[routeViewModel.name] = routeValue;
    });

    return routes;
};
