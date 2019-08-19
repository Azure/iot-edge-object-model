// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { EdgeConfigurationContentPatchViewModel } from '../viewModel/edgeConfigurationContentPatchViewModel';
import { generate$EdgeAgentConfigurationContentPatch as generate$EdgeAgentConfigurationContentPatch_v1  } from '../edgeAgent/version1_0/generator/$EdgeAgentConfigurationContentPatchGenerator';
import { generate$EdgeHubConfigurationContentPatch as generate$EdgeHubConfigurationContentPatch_v1  } from '../edgeHub/version1_0/generator/$EdgeHubConfigurationContentPatchGenerator';

export const generateConfigurationContentPatch = (edgeConfigurationContentPatchViewModel: EdgeConfigurationContentPatchViewModel): object => {
    const patchContent = {
        $edgeAgent : generate$EdgeAgentConfigurationContentPatch_v1(edgeConfigurationContentPatchViewModel),
        $edgeHub : generate$EdgeHubConfigurationContentPatch_v1(edgeConfigurationContentPatchViewModel)
    };

    if (!patchContent.$edgeHub || Object.keys(patchContent.$edgeHub).length === 0) {
        delete(patchContent.$edgeHub);
    }

    edgeConfigurationContentPatchViewModel.moduleSpecificationViewModels.forEach(viewModel => {
        if (viewModel.desiredProperties) {
            patchContent[viewModel.name] = viewModel.desiredProperties;
        }
    });

    return patchContent;
};
