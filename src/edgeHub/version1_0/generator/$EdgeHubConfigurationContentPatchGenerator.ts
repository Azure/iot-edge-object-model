// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeHubPatchEntries } from '../../../viewModel/edgeConfigurationContentPatchViewModel';
import { PATHS } from '../../../utilities/constants';
import { RoutePathType } from '../../../viewModel/routeViewModel';

export const generate$EdgeHubConfigurationContentPatch = (patchEntries: $EdgeHubPatchEntries): object => {
    const patchContent = {};
    const { additionalEdgeHubEntries, routeViewModels } = patchEntries;

    routeViewModels.forEach(routeViewModel => {
        const routePrefix = `${PATHS.DESIRED_PROPERTIES}.${PATHS.ROUTES}`;
        const routeValue = (routeViewModel.routeOptions) ? {
            priority: routeViewModel.routeOptions.priority,
            route: routeViewModel.value,
            timeToLiveSecs: routeViewModel.routeOptions.timeToLiveSecs,
        } : routeViewModel.value;

        if (routeViewModel.routePathType === RoutePathType.memberOfRoutesPath) {
            if (!patchContent[routePrefix]) {
                patchContent[routePrefix] = {};
            }
            patchContent[routePrefix][routeViewModel.name] = routeValue;
        } else {
            patchContent[`${routePrefix}.${routeViewModel.name}`] = routeValue;
        }
    });

    Object.keys(additionalEdgeHubEntries).forEach(key => {
        if (key !== PATHS.DESIRED_PROPERTIES) {
            patchContent[key] = additionalEdgeHubEntries[key];
        }
    });

    return patchContent;
};
