// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { StringMap } from '../utilities/stringMap';
import { EdgeConfigurationContentPatchViewModel, $EdgeAgentPatchEntries, $EdgeHubPatchEntries } from '../viewModel/edgeConfigurationContentPatchViewModel';
import { get$EdgeAgentPatchEntries as get$EdgeAgentPatchEntries_v1 } from '../edgeAgent/version1_0/parser/$EdgeAgentConfigurationContentPatchParser';
import { get$EdgeHubPatchEntries as get$EdgeHubPatchEntries_v1 } from '../edgeHub/version1_0/parser/$EdgeHubConfigurationContentPatchParser';
import { PATHS } from '../utilities/constants';

export const toEdgeConfigurationContentPatchViewModel = (modulesContent: StringMap<object>): EdgeConfigurationContentPatchViewModel => {
    const edgeAgentEntries = get$EdgeAgentPatchEntries(modulesContent[PATHS.$EDGE_AGENT], modulesContent);
    const edgeHubEntries = get$EdgeHubPatchEntries(modulesContent[PATHS.$EDGE_HUB]);

    const viewModel: EdgeConfigurationContentPatchViewModel = {
        additionalEdgeAgentEntries: edgeAgentEntries.additionalEdgeAgentEntries,
        additionalEdgeHubEntries: edgeHubEntries.additionalEdgeHubEntries,
        moduleSpecificationViewModels: edgeAgentEntries.moduleSpecificationViewModels,
        registryCredentials: edgeAgentEntries.registryCredentials,
        routePaths: edgeHubEntries.routePaths
    };

    return viewModel;
};

export const get$EdgeAgentPatchEntries = ($edgeAgent: object, modulesContent: StringMap<object>): $EdgeAgentPatchEntries => {
    return get$EdgeAgentPatchEntries_v1($edgeAgent, modulesContent);
};

export const get$EdgeHubPatchEntries = ($edgeHub: object): $EdgeHubPatchEntries => {
    return get$EdgeHubPatchEntries_v1($edgeHub);
};
