// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    $EdgeAgentSchemaVersionIsSupported,
    $EdgeHubSchemaVersionIsSupported,
    $EdgeAgentVersionSupportsFeature,
    $EdgeHubVersionSupportsFeature,
    EdgeAgentSchemaFeatures,
    EdgeHubSchemaFeatures,
    get$EdgeAgentFeatureGraph,
    get$EdgeHubFeatureGraph
} from './versionUtilities';

describe('getEdgeAgentFeatureGraph', () => {
    it('aggregates features', () => {
        const schemaVersions = {
            '1.0': {
                newFeatures: [],
                removedFeatures: []
            },
            '1.1': {
                newFeatures: [
                    EdgeAgentSchemaFeatures.MODULE_STARTUP_ORDER
                ],
                removedFeatures: []
            },
            '1.2': {
                newFeatures: [],
                removedFeatures: [ EdgeAgentSchemaFeatures.MODULE_STARTUP_ORDER ]
            }
        };

        const result = get$EdgeAgentFeatureGraph(schemaVersions);
        expect(result['1.0'].has(EdgeAgentSchemaFeatures.MODULE_STARTUP_ORDER)).toEqual(false);
        expect(result['1.1'].has(EdgeAgentSchemaFeatures.MODULE_STARTUP_ORDER)).toEqual(true);
        expect(result['1.2'].has(EdgeAgentSchemaFeatures.MODULE_STARTUP_ORDER)).toEqual(false);
    });
});

describe('getEdgeHubFeatureGraph', () => {
    it('aggregates features', () => {
        const schemaVersions = {
            '1.0': {
                newFeatures: [],
                removedFeatures: []
            },
            '1.1': {
                newFeatures: [
                    EdgeHubSchemaFeatures.ROUTE_PRIORITY
                ],
                removedFeatures: []
            },
            '1.2': {
                newFeatures: [],
                removedFeatures: [ EdgeHubSchemaFeatures.ROUTE_PRIORITY ]
            }
        };

        const result = get$EdgeHubFeatureGraph(schemaVersions);
        expect(result['1.0'].has(EdgeHubSchemaFeatures.ROUTE_PRIORITY)).toEqual(false);
        expect(result['1.1'].has(EdgeHubSchemaFeatures.ROUTE_PRIORITY)).toEqual(true);
        expect(result['1.2'].has(EdgeHubSchemaFeatures.ROUTE_PRIORITY)).toEqual(false);
    });
});

describe('$EdgeAgentSchemaVersionIsSupported', () => {
    it('returns true if version belongs to version manifest', () => {
        expect($EdgeAgentSchemaVersionIsSupported('1.1')).toEqual(true);
    });

    it('returns false if version belongs to version manifest', () => {
        expect($EdgeAgentSchemaVersionIsSupported('1.1.2')).toEqual(false);
    });

    it('returns false if version is undefined', () => {
        expect($EdgeAgentSchemaVersionIsSupported(undefined)).toEqual(false);
    });

    it('returns false if version is empty', () => {
        expect($EdgeAgentSchemaVersionIsSupported('')).toEqual(false);
    });

    it('returns false if version is null', () => {
        expect($EdgeAgentSchemaVersionIsSupported(null)).toEqual(false);
    });
});

describe('$EdgeHubSchemaVersionIsSupported', () => {
    it('returns true if version belongs to version manifest', () => {
        expect($EdgeHubSchemaVersionIsSupported('1.1')).toEqual(true);
    });

    it('returns false if version belongs to version manifest', () => {
        expect($EdgeHubSchemaVersionIsSupported('1.1.2')).toEqual(false);
    });

    it('returns false if version version is undefined', () => {
        expect($EdgeHubSchemaVersionIsSupported(undefined)).toEqual(false);
    });

    it('returns false if version version is empty', () => {
        expect($EdgeHubSchemaVersionIsSupported('')).toEqual(false);
    });

    it('returns false if version version is null', () => {
        expect($EdgeHubSchemaVersionIsSupported(null)).toEqual(false);
    });
});

describe('$EdgeAgentVersionSupportsFeature', () => {
    it('returns true if version supports enumerated capability', () => {
        expect($EdgeAgentVersionSupportsFeature('1.1', EdgeAgentSchemaFeatures.MODULE_STARTUP_ORDER)).toEqual(true);
    });

    it('returns false if version does not support enuemrated capability', () => {
        expect($EdgeAgentVersionSupportsFeature('1.0', EdgeAgentSchemaFeatures.MODULE_STARTUP_ORDER)).toEqual(false);
    });

    it ('returns true if version is undefined', () => {
        expect($EdgeAgentVersionSupportsFeature('', EdgeAgentSchemaFeatures.MODULE_STARTUP_ORDER)).toEqual(true);
    });
});

describe('$EdgeHubVersionSupportsFeature', () => {
    it('returns true if version supports enumerated capability', () => {
        expect($EdgeHubVersionSupportsFeature('1.1', EdgeHubSchemaFeatures.ROUTE_PRIORITY)).toEqual(true);
    });

    it('returns false if version does not support enuemrated capability', () => {
        expect($EdgeHubVersionSupportsFeature('1.0', EdgeHubSchemaFeatures.ROUTE_PRIORITY)).toEqual(false);
    });

    it ('returns true if version is undefined', () => {
        expect($EdgeHubVersionSupportsFeature(undefined, EdgeHubSchemaFeatures.ROUTE_PRIORITY)).toEqual(true);
    });
});
