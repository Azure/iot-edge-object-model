// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { generate$EdgeHubConfigurationContentPatch, conflictWithRouteEntry, conflictWithMqttBrokerEntry } from './$EdgeHubConfigurationContentPatchGenerator';
import { RoutePathType } from '../../../viewModel/routeViewModel';

describe('generate$EdgeHubConfigurationContentPatch', () => {
    it('returns route and additional entries', () => {
        const result = generate$EdgeHubConfigurationContentPatch({
            additionalEdgeHubEntries: {
                'properties.desired': 'hello',
                'properties.desired.routes.y.z': 'routeyz',
                'properties.desired.storeAndForward': '7',
                'properties.desired.mqttBroker.bridges': 'old bridge'
            },
            mqttBroker: `{"bridges": []}`,
            routeViewModels: [
                {
                    name: 'x',
                    routePathType: RoutePathType.standaloneRoutePath,
                    value: 'routex'
                },
                {
                    name: 'y',
                    priority: 100,
                    routePathType: RoutePathType.memberOfRoutesPath,
                    timeToLiveSecs: 10,
                    value: 'routey'
                },
                {
                    name: 'z',
                    routePathType: RoutePathType.memberOfRoutesPath,
                    value: 'routez'
                },
            ],
        });

        expect(result).toEqual({
            'properties.desired.mqttBroker': {'bridges': []},
            'properties.desired.routes': {
                y: {
                    priority: 100,
                    route: 'routey',
                    timeToLiveSecs: 10,
                },
                z: 'routez'
            },
            'properties.desired.routes.x': 'routex',
            'properties.desired.storeAndForward': '7',
        });
    });
});

describe('conflictWithRoute', () => {
    it('returns false if set is empty', () => {
        expect(conflictWithRouteEntry('', new Set<string>())).toEqual(false);
    });

    it('returns true if key is properties.desired', () => {
        const routeNames = new Set(['name']);
        const additionalEntry = 'properties.desired';
        expect(conflictWithRouteEntry(additionalEntry, routeNames)).toEqual(true);
    });

    it('returns true if key conflicts with route name', () => {
        const routeNames = new Set(['name']);
        const additionalEntry = 'properties.desired.routes.name.x';
        expect(conflictWithRouteEntry(additionalEntry, routeNames)).toEqual(true);
    });

    it('returns false if key does not conflict with route name', () => {
        const routeNames = new Set(['name']);
        const additionalEntry = 'properties.desired.routes.notName.x';
        expect(conflictWithRouteEntry(additionalEntry, routeNames)).toEqual(false);
    });
});

describe('conflictWithMqttBrokerEntry', () => {
    it('returns true if key starts with properties.desired.mqttBroker', () => {
        const additionalEntry = 'properties.desired.mqttBroker.bridges';
        expect(conflictWithMqttBrokerEntry(additionalEntry, 'something')).toEqual(true);
    })
})
