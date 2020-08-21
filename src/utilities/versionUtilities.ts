// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StringMap } from './stringMap';

export enum EdgeAgentSchemaFeatures {
    MODULE_STARTUP_ORDER = 'STARTUP_ORDER'
}

export enum EdgeHubSchemaFeatures {
    ROUTE_PRIORITY = 'ROUTE_PRIORITY',
    ROUTE_TIME_TO_LIVE = 'ROUTE_TIME_TO_LIVE'
}

interface EdgeSchemaVersion {
    newFeatures: string[];
    removedFeatures: string[];
}

export const $EdgeAgentSchemaVersions: StringMap<EdgeSchemaVersion> = {
    '1.0': {
        newFeatures: [],
        removedFeatures: []
    },
    '1.1': {
        newFeatures: [
            EdgeAgentSchemaFeatures.MODULE_STARTUP_ORDER
        ],
        removedFeatures: []
    }
};

export const $EdgeHubSchemaVersions: StringMap<EdgeSchemaVersion> = {
    '1.0': {
        newFeatures: [],
        removedFeatures: []
    },
    '1.1': {
        newFeatures: [
            EdgeHubSchemaFeatures.ROUTE_PRIORITY,
            EdgeHubSchemaFeatures.ROUTE_TIME_TO_LIVE
        ],
        removedFeatures: []
    }
};

export const $EdgeAgentSchemaVersionIsSupported = (version: string): boolean => {
    return !!$EdgeAgentSchemaVersions[version];
};

export const $EdgeHubSchemaVersionIsSupported = (version: string): boolean => {
    return !!$EdgeHubSchemaVersions[version];
};

export const $EdgeAgentVersionSupportsFeature = (version: string, feature: EdgeAgentSchemaFeatures): boolean => {
    // absence of version intentionally returns true.  Layered deployments do not recognize version and default to feature enabled.
    if (!version) {
        return true;
    }

    const featureGraph = get$EdgeAgentFeatureGraph($EdgeAgentSchemaVersions);
    if (featureGraph[version] && featureGraph[version].has(feature)) {
        return true;
    }

    return false;
};

let $EdgeAgentFeatureGraph: StringMap<Set<string>>;
export const get$EdgeAgentFeatureGraph = (schemaVersions: StringMap<EdgeSchemaVersion>): StringMap<Set<string>> => {
    if (!$EdgeAgentFeatureGraph) {
        $EdgeAgentFeatureGraph = {};

        const set = new Set<string>();
        Object.keys(schemaVersions).forEach(key => {
            schemaVersions[key].newFeatures.forEach(feature => set.add(feature));
            schemaVersions[key].removedFeatures.forEach(feature => set.delete(feature));
            $EdgeAgentFeatureGraph[key] = new Set<string>(set);
        });
    }

    return $EdgeAgentFeatureGraph;
};

export const $EdgeHubVersionSupportsFeature = (version: string, feature: EdgeHubSchemaFeatures): boolean => {
    // absence of version intentionally returns true.  Layered deployments do not recognize version and default to feature enabled.
    if (!version) {
        return true;
    }

    const featureGraph = get$EdgeHubFeatureGraph($EdgeAgentSchemaVersions);
    if (featureGraph[version] && featureGraph[version].has(feature)) {
        return true;
    }

    return false;
};

let $EdgeHubFeatureGraph: StringMap<Set<string>>;
export const get$EdgeHubFeatureGraph = (schemaVersions: StringMap<EdgeSchemaVersion>): StringMap<Set<string>> => {
    if (!$EdgeHubFeatureGraph) {
        $EdgeHubFeatureGraph = {};

        const set = new Set<string>();
        Object.keys(schemaVersions).forEach(key => {
            schemaVersions[key].newFeatures.forEach(feature => set.add(feature));
            schemaVersions[key].removedFeatures.forEach(feature => set.delete(feature));
            $EdgeHubFeatureGraph[key] = new Set<string>(set);
        });
    }

    return $EdgeHubFeatureGraph;
};
