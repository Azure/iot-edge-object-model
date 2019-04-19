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
});
