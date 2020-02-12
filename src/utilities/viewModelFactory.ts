// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EDGE_AGENT, $EDGE_HUB } from './constants';
import { $EdgeAgentDesiredPropertiesViewModel } from '../viewModel/$EdgeAgentDesiredPropertiesViewModel';
import { $EdgeHubDesiredPropertiesViewModel } from '../viewModel/$EdgeHubDesiredPropertiesViewModel';
import { EdgeConfigurationContentViewModel } from '../viewModel/edgeConfigurationContentViewModel';

export const newEdgeConfigurationContentViewModel = (): EdgeConfigurationContentViewModel => {
    return {
        $edgeAgentDesiredPropertiesViewModel: new$EdgeAgentDesiredPropertiesViewModelWithDefaults(),
        $edgeHubDesiredPropertiesViewModel: new$EdgeHubDesiredPropertiesViewModelWithDefaults()
    };
};

export const new$EdgeAgentDesiredPropertiesViewModelWithDefaults = (): $EdgeAgentDesiredPropertiesViewModel => {
    const $edgeAgentDesiredPropertiesViewModel: $EdgeAgentDesiredPropertiesViewModel = {
        edgeAgentModuleSpecificationViewModel: {
            createOptions: $EDGE_AGENT.EDGE_AGENT.CREATE_OPTIONS,
            environmentVariables: [],
            image: $EDGE_AGENT.EDGE_AGENT.IMAGE,
            imagePullPolicy: '',
            name: $EDGE_AGENT.EDGE_AGENT.NAME,
            type: $EDGE_AGENT.EDGE_AGENT.TYPE,
            version: ''
        },
        edgeHubModuleSpecificationViewModel: {
            createOptions: $EDGE_AGENT.EDGE_HUB.CREATE_OPTIONS,
            environmentVariables: [],
            image: $EDGE_AGENT.EDGE_HUB.IMAGE,
            imagePullPolicy: '',
            name: $EDGE_AGENT.EDGE_HUB.NAME,
            restartPolicy: $EDGE_AGENT.EDGE_HUB.RESTART_POLICY,
            status: $EDGE_AGENT.EDGE_HUB.STATUS,
            type: $EDGE_AGENT.EDGE_HUB.TYPE,
            version: ''
        },
        loggingOptions: $EDGE_AGENT.LOGGING_OPTIONS,
        minDockerVersion: $EDGE_AGENT.MIN_DOCKER_VERSION,
        moduleSpecificationViewModels: [],
        registyCredentials: [],
        runtimeType: $EDGE_AGENT.RUNTIME_TYPE,
        schemaVersion: $EDGE_AGENT.SCHEMA_VERSION_1_0
    };

    return $edgeAgentDesiredPropertiesViewModel;
};

export const new$EdgeHubDesiredPropertiesViewModelWithDefaults = (): $EdgeHubDesiredPropertiesViewModel => {
    return {
        routeViewModels: $EDGE_HUB.ROUTES,
        schemaVersion: $EDGE_HUB.SCHEMA_VERSION_1_0,
        storeAndForwardTimeToLive: $EDGE_HUB.STORE_AND_FORWARD_TIME_TO_LIVE
    };
};
