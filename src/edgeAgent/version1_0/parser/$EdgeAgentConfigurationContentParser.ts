// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeAgentConfigurationContent } from '../model/$EdgeAgentConfigurationContent';
import { $EdgeAgentDesiredPropertiesViewModel } from '../../../viewModel/$EdgeAgentDesiredPropertiesViewModel';
import { get$EdgeAgentDesiredPropertiesViewModel } from './$EdgeAgentDesiredPropertiesParser';
import { EdgeParseException } from '../../../errors/edgeParseException';
import { StringMap } from '../../../utilities/stringMap';
import { PATHS } from '../../../utilities/constants';

export const get$EdgeAgentDesiredPropertiesViewModelFromConfiguration = (edgeConfigurationContent: $EdgeAgentConfigurationContent): $EdgeAgentDesiredPropertiesViewModel => {
    ensure$EdgeAgent(edgeConfigurationContent);
    ensure$EdgeAgentDesiredProperties(edgeConfigurationContent);

    const $edgeAgentDesiredPropertiesViewModel = get$EdgeAgentDesiredPropertiesViewModel(edgeConfigurationContent.$edgeAgent['properties.desired']);

    if ($edgeAgentDesiredPropertiesViewModel.moduleSpecificationViewModels) {
        $edgeAgentDesiredPropertiesViewModel.moduleSpecificationViewModels.forEach(moduleSpecificationViewModel => {
            const desiredProperties = getModuleSpecificationDesiredProperties(edgeConfigurationContent, moduleSpecificationViewModel.name);
            moduleSpecificationViewModel.desiredProperties = desiredProperties;
        });
    }

    return $edgeAgentDesiredPropertiesViewModel;
};

// tslint:disable-next-line:no-any
export const getModuleSpecificationDesiredProperties = (edgeConfigurationContent: any, moduleName: string): StringMap<object> | null => {
    const moduleTwin = edgeConfigurationContent[moduleName];
    if (!moduleTwin) {
        return null;
    }

    const twinSettings: StringMap<object> = {};
    const properlyFormattedEntries = Object.keys(moduleTwin).filter(key => key.startsWith('properties.desired'));
    if (properlyFormattedEntries.length === 0) {
        return null;
    }

    properlyFormattedEntries.forEach(key => {
        twinSettings[key] = moduleTwin[key];
    });

    return twinSettings;
};

export const ensure$EdgeAgent = (edgeConfigurationContent: $EdgeAgentConfigurationContent) => {
    if (!edgeConfigurationContent.$edgeAgent) {
        throw new EdgeParseException(PATHS.$EDGE_AGENT);
    }
};

export const ensure$EdgeAgentDesiredProperties = (edgeConfigurationContent: $EdgeAgentConfigurationContent) => {
    if (!edgeConfigurationContent.$edgeAgent['properties.desired']) {
        throw new EdgeParseException([
            PATHS.$EDGE_AGENT,
            PATHS.DESIRED_PROPERTIES].join('.'));
    }
};
