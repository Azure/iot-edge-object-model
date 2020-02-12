// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import { sampleConfigurationContent } from '../../../utilities/testHelpers';
import { get$EdgeHubDesiredPropertiesViewModel, get$EdgeHubRoutes } from './$EdgeHubDesiredPropertiesParser';

describe('$EdgeHubDesiredPropertiesParser', () => {
    describe('get$EdgeHubDesiredPropertiesViewModel', () => {
        it('returns view model meeting specifications', () => {
            const content = sampleConfigurationContent();
            const edgeHubDesiredProperties = content.modulesContent.$edgeHub['properties.desired'];
            const edgeHubViewModel = get$EdgeHubDesiredPropertiesViewModel(edgeHubDesiredProperties);

            expect(edgeHubViewModel.schemaVersion).toEqual('1.0');
            expect(edgeHubViewModel.storeAndForwardTimeToLive).toEqual(0);
            expect(edgeHubViewModel.routes).toEqual([
                {
                    name: 'route',
                    value: 'FROM /* INTO $upstream'
                }
            ]);
        });

        it('throws exception if schemaVersion is not defined', () => {
            const content = sampleConfigurationContent();
            const edgeHubDesiredProperties = content.modulesContent.$edgeHub['properties.desired'];
            edgeHubDesiredProperties.schemaVersion = null;
            expect(() => get$EdgeHubDesiredPropertiesViewModel(edgeHubDesiredProperties)).toThrow();
        });

        it('throws exception if routes is not defined', () => {
            const content = sampleConfigurationContent();
            const edgeHubDesiredProperties = content.modulesContent.$edgeHub['properties.desired'];
            edgeHubDesiredProperties.routes = null;
            expect(() => get$EdgeHubDesiredPropertiesViewModel(edgeHubDesiredProperties)).toThrow();
        });

        it('throws exception if storeAndForwardConfiguration not defined', () => {
            const content = sampleConfigurationContent();
            const edgeHubDesiredProperties = content.modulesContent.$edgeHub['properties.desired'];
            edgeHubDesiredProperties.storeAndForwardConfiguration = null;
            expect(() => get$EdgeHubDesiredPropertiesViewModel(edgeHubDesiredProperties)).toThrow();
        });

        it('throws exception if timeToLive is not defined', () => {
            const content = sampleConfigurationContent();
            const edgeHubDesiredProperties = content.modulesContent.$edgeHub['properties.desired'];
            edgeHubDesiredProperties.storeAndForwardConfiguration.timeToLiveSecs = null;
            expect(() => get$EdgeHubDesiredPropertiesViewModel(edgeHubDesiredProperties)).toThrow();
        });
    });

    describe('get$EdgeHubRoutes', () => {
        it('returns RouteViewModel when route is string', () => {
            const routes = {
                route1: 'routeValue1',
                route2: 'routeValue2'
            };

            const content = sampleConfigurationContent();
            const edgeHubDesiredProperties = content.modulesContent.$edgeHub['properties.desired'];
            // tslint:disable-next-line:no-any
            edgeHubDesiredProperties.routes = routes as any;

            expect(get$EdgeHubRoutes(edgeHubDesiredProperties)).toEqual([
                {
                    name: 'route1',
                    value: 'routeValue1'
                },
                {
                    name: 'route2',
                    value: 'routeValue2'
                },
            ]);
        });

        it('returns RouteViewModel when route is data structure', () => {
            const routes = {
                route1: { route: 'routeValue1' },
                route2: { route: 'routeValue2', priority: 1, timeToLiveSecs: 200 }
            };

            const content = sampleConfigurationContent();
            const edgeHubDesiredProperties = content.modulesContent.$edgeHub['properties.desired'];
            // tslint:disable-next-line:no-any
            edgeHubDesiredProperties.routes = routes as any;

            expect(get$EdgeHubRoutes(edgeHubDesiredProperties)).toEqual([
                {
                    name: 'route1',
                    value: 'routeValue1'
                },
                {
                    name: 'route2',
                    priority: 1,
                    timeToLiveSecs: 200,
                    value: 'routeValue2'
                },
            ]);
        });
    });
});
