// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import { get$EdgeAgentDesiredPropertiesViewModelFromTwin, get$EdgeAgentReportedPropertiesViewModelFromTwin } from './$EdgeAgentModuleTwinParser';
import { sample$EdgeAgentModuleTwin } from '../../../utilities/testHelpers'
import * as $EdgeAgentDesiredPropertiesParser from './$EdgeAgentDesiredPropertiesParser';
import * as $EdgeAgentReportedPropertiesParser from './$EdgeAgentReportedPropertiesParser';

describe('$EdgeAGentModuleTwinParser', () => {
    describe('get$EdgeAgentDesiredPropertisViewModelFromTwin', () => {
        it('throws exception when edgeModuleTwin.properties is null or undefined', () => {
            const sampleTwin = {
                properties: null
            };
            expect(() => get$EdgeAgentDesiredPropertiesViewModelFromTwin(sampleTwin)).toThrow();
        });

        it('throws exception when edgeModuleTWin.properties.desired is null or undefined', () => {
            const sampleTwin = {
                properties: {
                    desired: null,
                    reported: null
                }
            };
            expect(() => get$EdgeAgentDesiredPropertiesViewModelFromTwin(sampleTwin)).toThrow();
        });

        it('call get$EdgeAgentDesiredPropertiesViewModel with desired properties', () => {
            const sampleTwin = sample$EdgeAgentModuleTwin();
            const spy = jest.spyOn($EdgeAgentDesiredPropertiesParser, 'get$EdgeAgentDesiredPropertiesViewModel');
            get$EdgeAgentDesiredPropertiesViewModelFromTwin(sampleTwin as any);

            expect(spy).toHaveBeenCalledWith(sampleTwin.properties.desired);
        });
    });

    describe('get$EdgeAgentReportedPropetiesViewModelFromTwin', () => {
        it('returns null when edgeModuleTwin.properties is null or undefined', () => {
            const sampleTwin = {
                properties: null
            };
            expect(get$EdgeAgentReportedPropertiesViewModelFromTwin(sampleTwin)).toBeNull();
        });

        it('returns null when edgeModuleTWin.properties.reported is null or undefined', () => {
            const sampleTwin = {
                properties: {
                    desired: null,
                    reported: null
                }
            };
            expect(get$EdgeAgentReportedPropertiesViewModelFromTwin(sampleTwin)).toBeNull();
        });

        it('call get$EdgeHubDesiredPropertiesViewModel with reported properties', () => {
            const sampleTwin = sample$EdgeAgentModuleTwin();
            const spy = jest.spyOn($EdgeAgentReportedPropertiesParser, 'get$EdgeAgentReportedPropertiesViewModel');
            get$EdgeAgentReportedPropertiesViewModelFromTwin(sampleTwin as any);

            expect(spy).toHaveBeenCalledWith(sampleTwin.properties.reported);
        });
    });
});
