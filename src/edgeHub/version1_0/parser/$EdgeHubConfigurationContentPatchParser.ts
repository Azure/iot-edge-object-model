// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { PATHS } from '../../../utilities/constants';
import { $EdgeHubPatchEntries } from '../../../viewModel/edgeConfigurationContentPatchViewModel';

export const get$EdgeHubPatchEntries = ($edgeHub: object): $EdgeHubPatchEntries => {
    const entries: $EdgeHubPatchEntries = {
        additionalEdgeHubEntries: {},
        routePaths: {},
    };

    if (!$edgeHub) {
        return entries;
    }

    const payload: Payload = {
        $edgeEntries: entries,
        $edgeObject: $edgeHub,
        key: '',
        pathArray: []
    };

    Object.keys($edgeHub).forEach(key => {
        const pathArray = key.split('.');
        payload.key = key;
        payload.pathArray = pathArray;

        if (!filterRoutePaths(payload)) {
            entries.additionalEdgeHubEntries[key] = $edgeHub[key];
        }
    });

    return entries;
};

export interface Payload {
    $edgeObject: object;
    $edgeEntries: $EdgeHubPatchEntries;
    key: string;
    pathArray: string[];
}

export const filterRoutePaths = (payload: Payload): boolean => {
    const routesPathDepth = 3; // properties.desired.routes.
    const { $edgeEntries, $edgeObject, key, pathArray } = payload;

    if (pathArray.length >= routesPathDepth &&
        pathArray[routesPathDepth - 1] === PATHS.ROUTES) {

        if (pathArray.length === routesPathDepth) {
            $edgeEntries.routePaths[PATHS.ROUTES] = $edgeObject[key];
            return true;
        }

        $edgeEntries.routePaths[key.replace(`${PATHS.DESIRED_PROPERTIES}.`, '')] = $edgeObject[key];
        return true;
    }

    return false;
};
