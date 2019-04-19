// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { EdgeConfigurationContentViewModel } from '../viewModel/edgeConfigurationContentViewModel';
import { generate$EdgeAgentConfigurationContent } from '../edgeAgent/version1_0/generator/$EdgeAgentConfigurationContentGenerator';
import { generate$EdgeHubConfigurationContent } from '../edgeHub/version1_0/generator/$EdgeHubConfigurationContentGenerator';
import { $EdgeAgentDesiredPropertiesViewModel } from '../viewModel/$EdgeAgentDesiredPropertiesViewModel';
import { StringMap } from '../utilities/stringMap';

export const generateConfigurationContent = (edgeConfigurationContentViewModel: EdgeConfigurationContentViewModel): object => {
    const configurationContent = {
        $edgeAgent: {
            'properties.desired': {}
        },
        $edgeHub: {
            'properties.desired': {}
        }
    };

    const edgeAgentContent = generate$EdgeAgentConfigurationContent(edgeConfigurationContentViewModel.$edgeAgentDesiredPropertiesViewModel);
    configurationContent.$edgeAgent['properties.desired'] = edgeAgentContent;

    const edgeHubContent = generate$EdgeHubConfigurationContent(edgeConfigurationContentViewModel.$edgeHubDesiredPropertiesViewModel);
    configurationContent.$edgeHub['properties.desired'] = edgeHubContent;

    amendEdgeModuleDesiredProperties(edgeConfigurationContentViewModel.$edgeAgentDesiredPropertiesViewModel, configurationContent);
    return configurationContent;
};

export const amendEdgeModuleDesiredProperties = (edgeAgentDesiredPropertiesViewModel: $EdgeAgentDesiredPropertiesViewModel, edgeConfigurationContent: StringMap<object>) => {
    if (!edgeAgentDesiredPropertiesViewModel ||
        !edgeAgentDesiredPropertiesViewModel.moduleSpecificationViewModels) {
            return;
    }

    edgeAgentDesiredPropertiesViewModel.moduleSpecificationViewModels.forEach(moduleSpecificationViewModel => {
        if (moduleSpecificationViewModel.desiredProperties) {
            edgeConfigurationContent[moduleSpecificationViewModel.name] = moduleSpecificationViewModel.desiredProperties;
        }
    });
};
