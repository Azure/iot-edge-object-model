import { generate$EdgeHubConfigurationContentPatch } from './$EdgeHubConfigurationContentPatchGenerator';

describe('generate$EdgeHubConfigurationContentPatch', () => {
    it('returns route and additional entries', () => {
        const result = generate$EdgeHubConfigurationContentPatch({
            additionalEdgeHubEntries: {
                'properties.desired': 'hello',
                'properties.desired.storeAndForward': '7',
            },
            routePaths: {
                'routes.x': 'routex',
                'routes.y.z': 'routeyz',
            },
        });

        expect(result).toEqual({
            'properties.desired.routes.x': 'routex',
            'properties.desired.routes.y.z': 'routeyz',
            'properties.desired.storeAndForward': '7',
        });
    });
});
