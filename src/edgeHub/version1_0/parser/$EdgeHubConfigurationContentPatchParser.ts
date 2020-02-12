// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { PATHS } from '../../../utilities/constants';
import { $EdgeHubPatchEntries } from '../../../viewModel/edgeConfigurationContentPatchViewModel';
import { getRouteViewModel } from './$EdgeHubDesiredPropertiesParser';
import { RoutePathType } from '../../../viewModel/routeViewModel';

export const get$EdgeHubPatchEntries = ($edgeHub: object): $EdgeHubPatchEntries => {
    const entries: $EdgeHubPatchEntries = {
        additionalEdgeHubEntries: {},
        routeViewModels: []
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

        // routes
        if (pathArray.length === routesPathDepth) {
            const routes = $edgeObject[key];
            $edgeEntries.routeViewModels = [
                ...$edgeEntries.routeViewModels,
                ...Object.keys(routes).map(routeKey => getRouteViewModel(routeKey, routes[routeKey], RoutePathType.memberOfRoutesPath))];
            return true;
        }

        // single route (do not include sub definitions (e.g. priority))
        if (pathArray.length === routesPathDepth + 1) {
            const routeKey = key.replace(`${PATHS.DESIRED_PROPERTIES}.${PATHS.ROUTES}.`, '');
            const routeViewModel = getRouteViewModel(routeKey, $edgeObject[key], RoutePathType.standaloneRoutePath);

            $edgeEntries.routeViewModels.push(routeViewModel);
            return true;
        }
    }

    return false;
};
