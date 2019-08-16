// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import { sampleConfigurationContent } from '../../../utilities/testHelpers';
import { get$EdgeHubDesiredPropertiesViewModel } from './$EdgeHubDesiredPropertiesParser';

describe('$EdgeHubDesiredPropertiesParser', () => {
    describe('get$EdgeHubDesiredPropertiesViewModel', () => {
        it('returns view model meeting specifications', () => {
            const content = sampleConfigurationContent();
            const edgeHubDesiredProperties = content.modulesContent.$edgeHub['properties.desired'];
            const edgeHubViewModel = get$EdgeHubDesiredPropertiesViewModel(edgeHubDesiredProperties);

            expect(edgeHubViewModel.schemaVersion).toEqual('1.0');
            expect(edgeHubViewModel.storeAndForwardTimeToLive).toEqual(0);
            expect(JSON.stringify(edgeHubViewModel.routes)).toEqual(
                JSON.stringify(content.modulesContent.$edgeHub['properties.desired'].routes));
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
});
