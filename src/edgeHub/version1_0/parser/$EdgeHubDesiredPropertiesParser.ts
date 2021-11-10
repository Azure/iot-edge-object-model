// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RouteViewModel, RoutePathType } from '../../../viewModel/routeViewModel';
import { $EdgeHubDesiredProperties } from '../model/$EdgeHubDesiredProperties';
import { $EdgeHubDesiredPropertiesViewModel } from '../../../viewModel/$EdgeHubDesiredPropertiesViewModel';
import { EdgeParseException } from '../../../errors/edgeParseException';
import { PATHS } from '../../../utilities/constants';
import { Route } from '../model/route';

export const get$EdgeHubDesiredPropertiesViewModel = (edgeHubDesiredProperties: $EdgeHubDesiredProperties): $EdgeHubDesiredPropertiesViewModel => {
    const $edgeHubDesiredPropertiesViewModel =  {
        mqttBroker: get$EdgeMqttBroker(edgeHubDesiredProperties),
        routeViewModels: get$EdgeHubRoutes(edgeHubDesiredProperties),
        schemaVersion: get$EdgeHubSchemaVersion(edgeHubDesiredProperties),
        storeAndForwardTimeToLive: get$EdgeHubStoreAndForwardTimeToLive(edgeHubDesiredProperties)
    };

    return $edgeHubDesiredPropertiesViewModel;
};

export const get$EdgeHubSchemaVersion = (edgeHubDesiredProperties: $EdgeHubDesiredProperties): string => {
    const schemaVersion = edgeHubDesiredProperties.schemaVersion;
    if (!schemaVersion) {
        throw new EdgeParseException([
            PATHS.$EDGE_HUB,
            PATHS.DESIRED_PROPERTIES,
            PATHS.SCHEMA_VERSION].join('.'));
    }

    return schemaVersion;
};

export const get$EdgeHubRoutes = (edgeHubDesiredProperties: $EdgeHubDesiredProperties): RouteViewModel[] => {
    if (!edgeHubDesiredProperties.routes) {
        throw new EdgeParseException([
            PATHS.$EDGE_HUB,
            PATHS.DESIRED_PROPERTIES,
            PATHS.ROUTES].join('.'));
    }

    const routeViewModels: RouteViewModel[] = [];
    const routeObject = edgeHubDesiredProperties.routes;
    Object.keys(edgeHubDesiredProperties.routes).forEach(key => {
        const routeValue: string | Route = routeObject[key];
        routeViewModels.push(getRouteViewModel(key, routeValue));
    });

    return routeViewModels;
};

export const get$EdgeHubStoreAndForwardTimeToLive = (edgeHubDesiredProperties: $EdgeHubDesiredProperties): number => {
    if (!edgeHubDesiredProperties.storeAndForwardConfiguration) {
        throw new EdgeParseException([
            PATHS.$EDGE_HUB,
            PATHS.DESIRED_PROPERTIES,
            PATHS.STORE_FORWARD_CONFIGURATION].join('.'));
    }

    const timeToLiveSecs = edgeHubDesiredProperties.storeAndForwardConfiguration.timeToLiveSecs;
    if (timeToLiveSecs === undefined || timeToLiveSecs === null) {
        throw new EdgeParseException([
            PATHS.$EDGE_HUB,
            PATHS.DESIRED_PROPERTIES,
            PATHS.STORE_FORWARD_CONFIGURATION,
            PATHS.TIME_TO_LIVE_SECONDS].join('.'));
    }

    return timeToLiveSecs;
};

export const get$EdgeMqttBroker =  (edgeHubDesiredProperties: $EdgeHubDesiredProperties): string => {
    if (!edgeHubDesiredProperties.mqttBroker) {
        return '';
    }

    return getMqttBroker(edgeHubDesiredProperties.mqttBroker);
};

export const getMqttBroker = (mqttValue: string | object): string => {
    if (typeof mqttValue === 'string') {
        return mqttValue;
    }
    else {
        return JSON.stringify(mqttValue);
    }
};

export const getRouteViewModel = (key: string, routeValue: string | Route, routePathType?: RoutePathType): RouteViewModel => {
    if (!routeValue || typeof routeValue === 'string') {
        return {
            name: key,
            routePathType,
            value: routeValue || ''
        };

    } else {
        return {
            name: key,
            priority: routeValue.priority !== undefined ? routeValue.priority.toString() : undefined,
            routePathType,
            timeToLiveSecs: routeValue.timeToLiveSecs !== undefined ? routeValue.timeToLiveSecs.toString() : undefined,
            value: routeValue.route || '',
        };
    }
};
