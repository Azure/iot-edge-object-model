// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import { sampleConfigurationContent } from '../../../utilities/testHelpers';
import { get$EdgeHubDesiredPropertiesViewModel, getMqttBroker, getRouteViewModel } from './$EdgeHubDesiredPropertiesParser';
import { RoutePathType } from '../../../viewModel/routeViewModel';

describe('$EdgeHubDesiredPropertiesParser', () => {
    describe('get$EdgeHubDesiredPropertiesViewModel', () => {
        it('returns view model meeting specifications', () => {
            const content = sampleConfigurationContent();
            const edgeHubDesiredProperties = content.modulesContent.$edgeHub['properties.desired'];
            const edgeHubViewModel = get$EdgeHubDesiredPropertiesViewModel(edgeHubDesiredProperties);

            expect(edgeHubViewModel.schemaVersion).toEqual('1.1');
            expect(edgeHubViewModel.storeAndForwardTimeToLive).toEqual(0);
            expect(edgeHubViewModel.routeViewModels).toEqual([
                {
                    name: 'route',
                    routePathType: undefined,
                    value: 'FROM /* INTO $upstream'
                }
            ]);
            expect(edgeHubViewModel.mqttBroker).toEqual(JSON.stringify({bridges: [], authorizations: []}));
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

    describe('getRouteViewModel', () => {
        it('returns RouteViewModel when route is string', () => {
            expect(getRouteViewModel('route1', 'routeValue1')).toEqual({
                name: 'route1',
                routePathType: undefined,
                value: 'routeValue1'
            });
        });

        it('returns RouteViewModel when route is data structure', () => {
            expect(getRouteViewModel('route1', { route: 'routeValue1', priority: 1, timeToLiveSecs: 200 })).toEqual({
                name: 'route1',
                priority: '1',
                routePathType: undefined,
                timeToLiveSecs: '200',
                value: 'routeValue1'
            });
        });

        it('returns RouteViewModel when route is data structure with missing properties', () => {
            expect(getRouteViewModel('route1', {})).toEqual({
                name: 'route1',
                priority: undefined,
                timeToLiveSecs: undefined,
                value: ''
            });
        });

        it('returns RouteViewModel with RoutePathType value set', () => {
            expect(getRouteViewModel('route1', {}, RoutePathType.memberOfRoutesPath)).toEqual({
                name: 'route1',
                priority: undefined,
                routePathType: RoutePathType.memberOfRoutesPath,
                timeToLiveSecs: undefined,
                value: ''
            });
        });
    });

    describe('getMqttBroker', () => {
        it('returns MqttBroker when value is string', () => {
            expect(getMqttBroker('test')).toEqual('test');
        });

        it('returns MqttBroker when value is object', () => {
            expect(getMqttBroker({"bridges": [], "authorizations": []})).toEqual(JSON.stringify({bridges: [], authorizations: []}));
        });
    });
});
