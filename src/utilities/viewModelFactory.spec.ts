// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import {
    newEdgeConfigurationContentViewModel,
    new$EdgeAgentDesiredPropertiesViewModelWithDefaults,
    new$EdgeHubDesiredPropertiesViewModelWithDefaults
} from './viewModelFactory';

describe('viewModelFactory', () => {
    describe('newEdgeConfigurationContentViewModel', () => {
        it('returns new EdgeConfigurationContentViewModel with defaults', () => {
            const result = newEdgeConfigurationContentViewModel();
            expect(result.$edgeAgentDesiredPropertiesViewModel).toEqual(new$EdgeAgentDesiredPropertiesViewModelWithDefaults());
            expect(result.$edgeHubDesiredPropertiesViewModel).toEqual(new$EdgeHubDesiredPropertiesViewModelWithDefaults());
        });
    });

    describe('new$EdgeAgentDesiredPropertiesViewModel', () => {
        it('uses latest version in new$EdgeAgentDesiredPropertiesViewModel', () => {
            expect(new$EdgeAgentDesiredPropertiesViewModelWithDefaults().schemaVersion).toEqual('1.1');
        });
    });

    describe('new$EdgeHubDesiredPropertiesViewModel', () => {
        it('uses latest version in new$EdgeHubDesiredPropertiesViewModel', () => {
            expect(new$EdgeHubDesiredPropertiesViewModelWithDefaults().schemaVersion).toEqual('1.1');
        });
    });
});
