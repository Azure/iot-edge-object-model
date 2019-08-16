// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import { get$EdgeAgentDesiredPropertiesViewModelFromConfiguration, getModuleSpecificationDesiredProperties } from './$EdgeAgentConfigurationContentParser';
import { sample$EdgeAgentDesiredPropertiesViewModel, sampleConfigurationContent } from '../../../utilities/testHelpers';
import * as $EdgeAgentDesirePropertiesParser from './$EdgeAgentDesiredPropertiesParser';

describe('$EdgeAGentConfigurationContentParser', () => {
    describe('get$EdgeAgentDesiredPropertiesViewModelFromConfiguration', () => {
        it('throws exception when $EdgeAgent is null', () => {
            const configurationContent = {
                $edgeAgent: null
            };
            expect(() => get$EdgeAgentDesiredPropertiesViewModelFromConfiguration(configurationContent)).toThrow();
        });

        it('throws exception when properties.desired of $EdgeAgent is null', () => {
            const configurationContent = {
                $edgeAgent: {
                    'properties.desired': null
                }
            };
            expect(() => get$EdgeAgentDesiredPropertiesViewModelFromConfiguration(configurationContent)).toThrow();
        });

        it('returns $EdgeAgentDesiredPropertiesViewModel given valid model', () => {
            const configurationContent = sampleConfigurationContent();
            const sampleViewModel = sample$EdgeAgentDesiredPropertiesViewModel();
            const parser = jest.spyOn($EdgeAgentDesirePropertiesParser, 'get$EdgeAgentDesiredPropertiesViewModel');
            parser.mockImplementation(() => {
                return sampleViewModel;
            });

            expect(get$EdgeAgentDesiredPropertiesViewModelFromConfiguration(configurationContent.modulesContent)).toEqual(sampleViewModel);
        });

        it('does not iterate for module specification desired properties when moduleSpecificationViewModels is undefined', () => {
            const configurationContent = sampleConfigurationContent();
            const sampleViewModel = sample$EdgeAgentDesiredPropertiesViewModel();
            sampleViewModel.moduleSpecificationViewModels = null;
            const parser = jest.spyOn($EdgeAgentDesirePropertiesParser, 'get$EdgeAgentDesiredPropertiesViewModel');
            parser.mockImplementation(() => {
                return sampleViewModel;
            });

            expect(get$EdgeAgentDesiredPropertiesViewModelFromConfiguration(configurationContent.modulesContent).moduleSpecificationViewModels).toEqual(null);
        });
    });

    describe('getModuleSpecificationDesiredProperties', () => {
        it('returns null when module twin is null or undefined', () => {
            const configurationContent = sampleConfigurationContent();
            configurationContent.modulesContent.moduleName1 = null;
            expect(getModuleSpecificationDesiredProperties(configurationContent.modulesContent, 'moduleName1')).toEqual(null);
        });

        it('returns null if no properly formatted entries present', () => {
            const configurationContent = sampleConfigurationContent();
            let module1 = configurationContent.modulesContent.moduleName1 as any;  // tslint:disable-line:no-any
            module1 = {};

            configurationContent.modulesContent.moduleName1 = module1;
            expect(getModuleSpecificationDesiredProperties(configurationContent.modulesContent, 'moduleName1')).toEqual(null);
        });

        it('returns properties.desired', () => {
            const configurationContent = sampleConfigurationContent();
            configurationContent.modulesContent.moduleName1['properties.desired'] = { hello: 'value'};
            expect(getModuleSpecificationDesiredProperties(configurationContent.modulesContent, 'moduleName1')['properties.desired']).toEqual({hello: 'value'});
        });

        it('filters compliant desired property paths.', () => {
            const configurationContent = sampleConfigurationContent();
            configurationContent.modulesContent.moduleName1['properties.desired.x'] = { hello: 'value'};
            configurationContent.modulesContent.moduleName1['y'] = { hello: 'value'}; // tslint:disable-line:no-string-literal

            const result = getModuleSpecificationDesiredProperties(configurationContent.modulesContent, 'moduleName1');
            expect(result['properties.desired.x']).toEqual({hello: 'value'});
            expect(result['y']).toBeUndefined(); // tslint:disable-line:no-string-literal
        });
    });
});
