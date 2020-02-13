// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { generate$EdgeHubConfigurationContentPatch } from './$EdgeHubConfigurationContentPatchGenerator';
import { RoutePathType } from '../../../viewModel/routeViewModel';

describe('generate$EdgeHubConfigurationContentPatch', () => {
    it('returns route and additional entries', () => {
        const result = generate$EdgeHubConfigurationContentPatch({
            additionalEdgeHubEntries: {
                'properties.desired': 'hello',
                'properties.desired.routes.y.z': 'routeyz',
                'properties.desired.storeAndForward': '7'
            },
            routeViewModels: [
                {
                    name: 'x',
                    routePathType: RoutePathType.standaloneRoutePath,
                    value: 'routex'
                },
                {
                    name: 'y',
                    routeOptions: {
                        priority: 100,
                        timeToLiveSecs: 10,
                    },
                    routePathType: RoutePathType.memberOfRoutesPath,
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
            'properties.desired.routes': {
                y: {
                    priority: 100,
                    route: 'routey',
                    timeToLiveSecs: 10,
                },
                z: 'routez'
            },
            'properties.desired.routes.x': 'routex',
            'properties.desired.routes.y.z': 'routeyz',
            'properties.desired.storeAndForward': '7',
        });
    });
});
