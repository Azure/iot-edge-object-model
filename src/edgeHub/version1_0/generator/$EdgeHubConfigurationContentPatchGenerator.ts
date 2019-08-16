// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeHubPatchEntries } from '../../../viewModel/edgeConfigurationContentPatchViewModel';
import { PATHS } from '../../../utilities/constants';

export const generate$EdgeHubConfigurationContentPatch = (patchEntries: $EdgeHubPatchEntries): object => {
    const patchContent = {};
    const routePathNames = new Set<string>();
    const { additionalEdgeHubEntries, routePaths} = patchEntries;

    Object.keys(routePaths).forEach(key => {
        patchContent[`${PATHS.DESIRED_PROPERTIES}.${key}`] = routePaths[key];
        routePathNames.add(key);
    });

    Object.keys(additionalEdgeHubEntries).forEach(key => {
        if (key !== PATHS.DESIRED_PROPERTIES) {
            patchContent[key] = additionalEdgeHubEntries[key];
        }
    });

    return patchContent;
};
