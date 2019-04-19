// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import { sample$EdgeHubModuleTwin } from '../../../utilities/testHelpers';
import * as $EdgeHubDesiredPropertiesParser from './$EdgeHubDesiredPropertiesParser';
import * as $EdgeHubReportedPropertiesParser from './$EdgeHubReportedPropertiesParser';
import { get$EdgeHubDesiredPropertiesViewModelFromTwin, get$EdgeHubReportedPropertiesViewModelFromTwin} from './$EdgeHubModuleTwinParser';

describe('$EdgeHubModuleTwinParser', () => {
    describe('get$EdgeHubDesiredPropertiesViewModelFromTwin', () => {
        it('throws exception when properties not defined', () => {
            const input = {
                properties: null
            };
            expect(() => get$EdgeHubDesiredPropertiesViewModelFromTwin(input as any)).toThrow()
        });

        it('throws exception when desired properties not defined', () => {
            const input = {
                properties: {
                    desired: null
                }
            };
            expect(() => get$EdgeHubDesiredPropertiesViewModelFromTwin(input as any)).toThrow()
        });

        it('returns $EdgeHubDesiredPropertiesViewModel', () => {
            const input = sample$EdgeHubModuleTwin();
            const spy = jest.spyOn($EdgeHubDesiredPropertiesParser, 'get$EdgeHubDesiredPropertiesViewModel');
            spy.mockImplementation(() => {});

            expect(get$EdgeHubDesiredPropertiesViewModelFromTwin(input as any)).not.toBeNull();
            expect(spy).toHaveBeenCalledTimes(1);
        })
    });

    describe('get$EdgeHubReportedPropertiesViewModelFromTwin', () => {
        it('returns $EdgeHubReportedPropertiesViewModel', () => {
            const input = sample$EdgeHubModuleTwin();
            const spy = jest.spyOn($EdgeHubReportedPropertiesParser, 'get$EdgeHubReportedPropertiesViewModel');
            spy.mockImplementation(() => {});

            expect(get$EdgeHubReportedPropertiesViewModelFromTwin(input as any)).not.toBeNull();
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });
});
