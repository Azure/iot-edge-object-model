// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { get$EdgeAgentDesiredPropertiesViewModelFromTwin, get$EdgeAgentReportedPropertiesViewModelFromTwin } from '../edgeAgent/version1_0/parser/$EdgeAgentModuleTwinParser';
import { $EdgeAgentModuleTwinViewModel } from '../viewModel/$EdgeAgentModuleTwinViewModel';
import { $EdgeAgentReportedPropertiesViewModel } from '../viewModel/$EdgeAgentReportedPropertiesViewModel';
import { $EdgeAgentDesiredPropertiesViewModel } from '../viewModel/$EdgeAgentDesiredPropertiesViewModel';
import { ConfigurationViewModel } from '../viewModel/configurationViewModel';
import { EdgeUnsupportedSchemaException } from '../errors/edgeUnsupportedSchemaException';
import { getVersion } from '../utilities/versionUtilities';
import { StringMap } from '../utilities/stringMap';

export interface $EdgeAgentModuleTwin {
    moduleId: string;
    deviceId: string;
    properties: {
        desired: {
            schemaVersion: string;
        },
        reported?: {
            schemaVersion: string;
        }
    };
    configurations?: StringMap<{status: string}>;
}

export const to$EdgeAgentModuleTwinViewModel = (edgeAgentModuleTwin: $EdgeAgentModuleTwin): $EdgeAgentModuleTwinViewModel => {
    const edgeAgentModuleTwinViewModel = {
        configurations: getConfigurationViewModels(edgeAgentModuleTwin),
        desiredPropertiesViewModel: get$EdgeAgentDesiredPropertiesViewModel(edgeAgentModuleTwin),
        reportedPropertiesViewModel: get$EdgeAgentReportedPropertiesViewModel(edgeAgentModuleTwin)
    };

    return edgeAgentModuleTwinViewModel;
};

export const get$EdgeAgentDesiredPropertiesViewModel = (edgeAgentModuleTwin: $EdgeAgentModuleTwin): $EdgeAgentDesiredPropertiesViewModel | null => {
    if (!edgeAgentModuleTwin.properties ||
        !edgeAgentModuleTwin.properties.desired ||
        !edgeAgentModuleTwin.properties.desired.schemaVersion) {
            return null;
    }

    const schemaVersionString: string = edgeAgentModuleTwin.properties.desired.schemaVersion || '';
    const schemaVersion = getVersion(schemaVersionString);

    if (schemaVersion.major === 1) {
        // tslint:disable-next-line:no-any
        return get$EdgeAgentDesiredPropertiesViewModelFromTwin(edgeAgentModuleTwin as any);
    } else {
        throw new EdgeUnsupportedSchemaException(schemaVersionString);
    }
};

export const get$EdgeAgentReportedPropertiesViewModel = (edgeAgentModuleTwin: $EdgeAgentModuleTwin): $EdgeAgentReportedPropertiesViewModel | null => {
    if (!edgeAgentModuleTwin.properties ||
        !edgeAgentModuleTwin.properties.reported ||
        !edgeAgentModuleTwin.properties.reported.schemaVersion) {
            return null;
    }

    const schemaVersionString: string = edgeAgentModuleTwin.properties.reported.schemaVersion || '';
    const schemaVersion = getVersion(schemaVersionString);

    if (schemaVersion.major === 1) {
        // tslint:disable-next-line:no-any
        return get$EdgeAgentReportedPropertiesViewModelFromTwin(edgeAgentModuleTwin as any);
    } else {
        throw new EdgeUnsupportedSchemaException(schemaVersionString);
    }
};

export const getConfigurationViewModels = (edgeAgentModuleTwin: $EdgeAgentModuleTwin): ConfigurationViewModel[] => {
    if (!edgeAgentModuleTwin || !edgeAgentModuleTwin.configurations) {
        return [];
    }

    const configurations = edgeAgentModuleTwin.configurations;
    return Object.keys(configurations).map(key => {
        return {
            name: key,
            status: configurations[key].status
        };
    });
};
