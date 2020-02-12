// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { get$EdgeHubPatchEntries, filterRoutePaths } from './$EdgeHubConfigurationContentPatchParser';
import { RoutePathType } from '../../../viewModel/routeViewModel';

describe('get$EdgeHubPatchEntries', () => {
    it('returns specified object given a falsy value', () => {
        expect(get$EdgeHubPatchEntries(undefined)).toEqual({
            additionalEdgeHubEntries: {},
            routeViewModels: [],
        });
    });

    it('returns specified object given empty object', () => {
        expect(get$EdgeHubPatchEntries({})).toEqual({
            additionalEdgeHubEntries: {},
            routeViewModels: [],
        });
    });

    it('returns value to specification', () => {
        const $edgeHub = {
            'properties.desired.a': 'a',
            'properties.desired.routes': { myRoutes: 'route'},
            'properties.desired.routes.y': 'value',
            'properties.desired.routes.y.z': 'subRoute',
            'properties.desired.y.z.alpha': 'alpha'
        };

        const result = get$EdgeHubPatchEntries($edgeHub);
        expect(Object.keys(result.additionalEdgeHubEntries)).toHaveLength(3); // tslint:disable-line:no-magic-numbers
        expect(result.additionalEdgeHubEntries['properties.desired.a']).toEqual('a');
        expect(result.additionalEdgeHubEntries['properties.desired.y.z.alpha']).toEqual('alpha');
        expect(result.additionalEdgeHubEntries['properties.desired.routes.y.z']).toEqual('subRoute');

        expect(result.routeViewModels).toEqual([
            {
                name: 'myRoutes',
                routePathType: RoutePathType.memberOfRoutesPath,
                value: 'route'
            },
            {
                name: 'y',
                routePathType: RoutePathType.standaloneRoutePath,
                value: 'value'
            }
        ]);
    });
});

describe('filterRoutePaths', () => {
    it('returns false when pathArray.length < 3', () => {
        const payload = {
            $edgeEntries: {
                additionalEdgeHubEntries: {},
                routeViewModels: []
            },
            $edgeObject: null,
            key: 'props.something',
            pathArray: ['props', 'something']
        };

        expect(filterRoutePaths(payload)).toEqual(false);
    });

    it('returns false when pathArray does not contain ROUTES as designated segment.', () => {
        const payload = {
            $edgeEntries: {
                additionalEdgeHubEntries: {},
                routeViewModels: []
            },
            $edgeObject: null,
            key: 'properties.desiresd.notRoutes',
            pathArray: ['properties', 'desired', 'notRoutes']
        };

        expect(filterRoutePaths(payload)).toEqual(false);
    });

    it('returns true and amends routes entries when routes object defined', () => {
        const payload = {
            $edgeEntries: {
                additionalEdgeHubEntries: {},
                routeViewModels: []
            },
            $edgeObject: {
                'properties.desired.routes': { myRoute: 'my route'}
            },
            key: 'properties.desired.routes',
            pathArray: ['properties', 'desired', 'routes']
        };

        expect(filterRoutePaths(payload)).toEqual(true);
        expect(payload.$edgeEntries.routeViewModels).toEqual([
            {
                name: 'myRoute',
                routePathType: RoutePathType.memberOfRoutesPath,
                value: 'my route'
            }
        ]);
    });

    it('returns true when route path defined and amends the route path', () => {
        const payload = {
            $edgeEntries: {
                additionalEdgeHubEntries: {},
                routeViewModels: []
            },
            $edgeObject: {
                'properties.desired.routes.myRoute': 'my route'
            },
            key: 'properties.desired.routes.myRoute',
            pathArray: ['properties', 'desired', 'routes', 'myRoute']
        };

        expect(filterRoutePaths(payload)).toEqual(true);
        expect(payload.$edgeEntries.routeViewModels).toEqual([
            {
                name: 'myRoute',
                routePathType: RoutePathType.standaloneRoutePath,
                value: 'my route'
            }
        ]);
    });

    it('returns false when route path depth exceeded', () => {
        const payload = {
            $edgeEntries: {
                additionalEdgeHubEntries: {},
                routeViewModels: []
            },
            $edgeObject: {
                'properties.desired.routes.myRoute.x': 'my route'
            },
            key: 'properties.desired.routes.myRoute.x',
            pathArray: ['properties', 'desired', 'routes', 'myRoute', 'x']
        };

        expect(filterRoutePaths(payload)).toEqual(false);
        expect(payload.$edgeEntries.routeViewModels).toEqual([]);
    });
});
