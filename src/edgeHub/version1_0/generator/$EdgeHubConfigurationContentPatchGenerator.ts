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
        const routeValue = (routeViewModel.priority !== undefined || routeViewModel.timeToLiveSecs !== undefined) ? {
            priority: routeViewModel.priority ? parseInt(routeViewModel.priority, 10) : undefined,
            route: routeViewModel.value,
            timeToLiveSecs: routeViewModel.timeToLiveSecs ? parseInt(routeViewModel.timeToLiveSecs, 10) : undefined,
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

    if (patchEntries.mqttBroker) {
        const mqttBrokerPrefix = `${PATHS.DESIRED_PROPERTIES}.${PATHS.MQTT_BROKER}`;
        try {
            patchContent[mqttBrokerPrefix] = JSON.parse(patchEntries.mqttBroker);
        }
        catch {
            // intentionally swallow the error
        }
    }

    const routeNames = new Set(routeViewModels.map(s => s.name));
    Object.keys(additionalEdgeHubEntries).forEach(key => {
        if (!conflictWithRouteEntry(key, routeNames) &&
            !conflictWithMqttBrokerEntry(key, patchEntries.mqttBroker)) {
            patchContent[key] = additionalEdgeHubEntries[key];
        }
    });

    return patchContent;
};

export const conflictWithRouteEntry = (key: string, routeNames: Set<string>): boolean => {
    const customRouteDepth = 4;
    if (routeNames.size === 0) {
        return false;
    }

    if (key === PATHS.DESIRED_PROPERTIES) {
        return true;
    }

    if (key.startsWith(`${PATHS.DESIRED_PROPERTIES}.${PATHS.ROUTES}`)) {
        const pathArray = key.split('.');

        if (pathArray.length > customRouteDepth &&
            routeNames.has(pathArray[customRouteDepth - 1])) {
            return true;
        }
    }

    return false;
};

export const conflictWithMqttBrokerEntry = (key: string, mqttBrokerContent?: string): boolean => {
    if (!mqttBrokerContent) {
        return false;
    }

    if (key.startsWith(`${PATHS.DESIRED_PROPERTIES}.${PATHS.MQTT_BROKER}`)) {
        return true;
    }

    return false;
};
