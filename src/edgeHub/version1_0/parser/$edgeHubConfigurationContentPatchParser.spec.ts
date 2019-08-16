// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { get$EdgeHubPatchEntries, filterRoutePaths } from './$EdgeHubConfigurationContentPatchParser';

describe('get$EdgeHubPatchEntries', () => {
    it('returns specified object given a falsy value', () => {
        expect(get$EdgeHubPatchEntries(undefined)).toEqual({
            additionalEdgeHubEntries: {},
            routePaths: {},
        });
    });

    it('returns specified object given empty object', () => {
        expect(get$EdgeHubPatchEntries({})).toEqual({
            additionalEdgeHubEntries: {},
            routePaths: {},
        });
    });

    it('returns value to specification', () => {
        const $edgeHub = {
            'properties.desired.a': 'a',
            'properties.desired.routes': { myRoutes: 'route'},
            'properties.desired.y.z.alpha': 'alpha'
        };

        const result = get$EdgeHubPatchEntries($edgeHub);
        expect(Object.keys(result.additionalEdgeHubEntries)).toHaveLength(2); // tslint:disable-line:no-magic-numbers
        expect(result.additionalEdgeHubEntries['properties.desired.a']).toEqual('a');
        expect(result.additionalEdgeHubEntries['properties.desired.y.z.alpha']).toEqual('alpha');

        expect(result.routePaths).toEqual({ routes: { myRoutes: 'route'}});
    });
});

describe('filterRoutePaths', () => {
    it('returns false when pathArray.length < 3', () => {
        const payload = {
            $edgeEntries: {
                additionalEdgeHubEntries: {},
                routePaths: {}
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
                routePaths: {}
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
                routePaths: {}
            },
            $edgeObject: {
                'properties.desired.routes': { myRoute: 'my route'}
            },
            key: 'properties.desired.routes',
            pathArray: ['properties', 'desired', 'routes']
        };

        expect(filterRoutePaths(payload)).toEqual(true);
        expect(payload.$edgeEntries.routePaths).toEqual({
           routes: { myRoute: 'my route' }
        });
    });

    it('returns true when route path defined and amends the route path', () => {
        const payload = {
            $edgeEntries: {
                additionalEdgeHubEntries: {},
                routePaths: {}
            },
            $edgeObject: {
                'properties.desired.routes.myRoute': 'my route'
            },
            key: 'properties.desired.routes.myRoute',
            pathArray: ['properties', 'desired', 'routes', 'myRoute']
        };

        expect(filterRoutePaths(payload)).toEqual(true);
        expect(payload.$edgeEntries.routePaths).toEqual({
           'routes.myRoute': 'my route'
        });
    });

    it('returns true when route path depth exceeded', () => {
        const payload = {
            $edgeEntries: {
                additionalEdgeHubEntries: {},
                routePaths: {}
            },
            $edgeObject: {
                'properties.desired.routes.myRoute.x': 'my route'
            },
            key: 'properties.desired.routes.myRoute.x',
            pathArray: ['properties', 'desired', 'routes', 'myRoute', 'x']
        };

        expect(filterRoutePaths(payload)).toEqual(true);
        expect(payload.$edgeEntries.routePaths).toEqual({
            'routes.myRoute.x': 'my route'
         });
    });
});
