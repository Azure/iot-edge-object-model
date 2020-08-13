// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { get$EdgeAgentDesiredPropertiesViewModelFromConfiguration } from '../edgeAgent/version1_0/parser/$EdgeAgentConfigurationContentParser';
import { get$EdgeHubDesiredPropertiesViewModelFromConfiguration } from '../edgeHub/version1_0/parser/$EdgeHubConfigurationContentParser';
import { $EdgeAgentConfigurationContent as $EdgeAgentConfigurationContent1_0 } from '../edgeAgent/version1_0/model/$EdgeAgentConfigurationContent';
import { $EdgeHubConfigurationContent as $EdgeHubConfigurationContent1_0 } from '../edgeHub/version1_0/model/$EdgeHubConfigurationContent';
import { EdgeConfigurationContentViewModel } from '../viewModel/edgeConfigurationContentViewModel';
import { EdgeParseException } from '../errors/edgeParseException';
import { EdgeUnsupportedSchemaException } from '../errors/edgeUnsupportedSchemaException';
import { $EdgeAgentDesiredPropertiesViewModel } from '../viewModel/$EdgeAgentDesiredPropertiesViewModel';
import { $EdgeHubDesiredPropertiesViewModel } from '../viewModel/$EdgeHubDesiredPropertiesViewModel';
import { $EdgeAgentSchemaVersionIsSupported, $EdgeHubSchemaVersionIsSupported } from '../utilities/versionUtilities';
import { PATHS } from '../utilities/constants';

export interface $EdgeAgentConfigurationContent {
    $edgeAgent: {
        'properties.desired': {
            schemaVersion: string
        }
    };
}

export interface $EdgeHubConfigurationContent {
    $edgeHub: {
        'properties.desired': {
            schemaVersion: string;
        }
    };
}

export const toEdgeConfigurationContentViewModel = (edgeConfigurationContent: $EdgeAgentConfigurationContent & $EdgeHubConfigurationContent): EdgeConfigurationContentViewModel => {
    const configurationContentViewModel = {
        $edgeAgentDesiredPropertiesViewModel: get$EdgeAgentDesiredPropertiesViewModel(edgeConfigurationContent),
        $edgeHubDesiredPropertiesViewModel: get$EdgeHubDesiredPropertiesViewModel(edgeConfigurationContent)
    };

    return configurationContentViewModel;
};

export const get$EdgeAgentDesiredPropertiesViewModel = (edgeConfigurationContent: $EdgeAgentConfigurationContent): $EdgeAgentDesiredPropertiesViewModel => {
    if (!edgeConfigurationContent ||
        !edgeConfigurationContent.$edgeAgent ||
        !edgeConfigurationContent.$edgeAgent['properties.desired']) {
            throw new EdgeParseException([
                PATHS.$EDGE_AGENT,
                PATHS.DESIRED_PROPERTIES,
                PATHS.SCHEMA_VERSION].join('.'));
    }

    const schemaVersionString = edgeConfigurationContent.$edgeAgent['properties.desired'].schemaVersion || '';
    if ($EdgeAgentSchemaVersionIsSupported(schemaVersionString)) {
        return get$EdgeAgentDesiredPropertiesViewModelFromConfiguration(edgeConfigurationContent as $EdgeAgentConfigurationContent1_0);
    } else {
        throw new EdgeUnsupportedSchemaException(schemaVersionString);
    }
};

export const get$EdgeHubDesiredPropertiesViewModel = (edgeConfigurationContent: $EdgeHubConfigurationContent): $EdgeHubDesiredPropertiesViewModel => {
    if (!edgeConfigurationContent ||
        !edgeConfigurationContent.$edgeHub ||
        !edgeConfigurationContent.$edgeHub['properties.desired']) {
            throw new EdgeParseException([
                PATHS.$EDGE_HUB,
                PATHS.DESIRED_PROPERTIES,
                PATHS.SCHEMA_VERSION].join('.'));
    }

    const schemaVersionString = edgeConfigurationContent.$edgeHub['properties.desired'].schemaVersion || '';
    if ($EdgeHubSchemaVersionIsSupported(schemaVersionString)) {
        return get$EdgeHubDesiredPropertiesViewModelFromConfiguration(edgeConfigurationContent as $EdgeHubConfigurationContent1_0);
    } else {
        throw new EdgeUnsupportedSchemaException(schemaVersionString);
    }
};
