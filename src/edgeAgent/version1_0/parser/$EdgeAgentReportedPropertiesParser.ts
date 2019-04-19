// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeAgentReportedPropertiesViewModel } from '../../../viewModel/$EdgeAgentReportedPropertiesViewModel';
import { $EdgeAgentReportedProperties } from '../model/$EdgeAgentReportedProperties';
import { EdgeModuleReport } from '../model/edgeModuleReport';
import { EdgeModuleReportViewModel } from '../../../viewModel/edgeModuleReportViewModel';
import { ensureDate } from '../../../utilities/parseUtilities';

export const get$EdgeAgentReportedPropertiesViewModel = (edgeAgentReport: $EdgeAgentReportedProperties): $EdgeAgentReportedPropertiesViewModel => {

    const $edgeAgentReportViewModel = {
        edgeAgentModuleReportViewModel: getEdgeAgentModuleReportViewModel(edgeAgentReport),
        edgeHubModuleReportViewModel: getEdgeHubModuleReportViewModel(edgeAgentReport),
        edgeModuleReportViewModels: getModuleReportViewModels(edgeAgentReport),
        runtimeResponseCode: getRuntimeResponseCode(edgeAgentReport)
    };

    return $edgeAgentReportViewModel;
};

export const getRuntimeResponseCode = (edgeAgentReport: $EdgeAgentReportedProperties): number | null => {
    if (!edgeAgentReport.lastDesiredStatus || edgeAgentReport.lastDesiredStatus.code === undefined) {
        return null;
    }

    return edgeAgentReport.lastDesiredStatus.code;
};

export const getModuleReportViewModels = (edgeAgentReport: $EdgeAgentReportedProperties): EdgeModuleReportViewModel[] => {
    const modules = edgeAgentReport.modules;
    if (!modules) {
        return [];
    }

    const modulesReportViewModels = Object.keys(modules)
        .filter(key => !!modules[key])
        .map(key => getEdgeModuleReportViewModel(modules[key], key));

    return modulesReportViewModels;
};

export const getEdgeAgentModuleReportViewModel = (edgeAgentReport: $EdgeAgentReportedProperties): EdgeModuleReportViewModel | null => {
    if (!edgeAgentReport.systemModules ||
        !edgeAgentReport.systemModules.edgeAgent) {
            return null;
        }

    const edgeModuleReportViewModel = getEdgeModuleReportViewModel(edgeAgentReport.systemModules.edgeAgent, 'edgeAgent');
    return edgeModuleReportViewModel;
};

export const getEdgeHubModuleReportViewModel = (edgeAgentReport: $EdgeAgentReportedProperties): EdgeModuleReportViewModel | null => {
    if (!edgeAgentReport.systemModules ||
        !edgeAgentReport.systemModules.edgeHub) {
            return null;
        }

    const edgeModuleReportViewModel = getEdgeModuleReportViewModel(edgeAgentReport.systemModules.edgeHub, 'edgeHub');
    return edgeModuleReportViewModel;
};

export const getEdgeModuleReportViewModel = (edgeModuleReport: EdgeModuleReport, name: string): EdgeModuleReportViewModel => {
    const edgeModuleReportViewModel: EdgeModuleReportViewModel = {
        createOptions: '',
        environmentVariables: [],
        exitCode: null,
        image: '',
        lastExitTimeUtc: null,
        lastRestartTimeUtc: null,
        lastStartTimeUtc: null,
        name,
        restartCount: null,
        restartPolicy: '',
        runtimeStatus: '',
        status: '',
        statusDescription: '',
        type: '',
        version: ''
    };

    if (edgeModuleReport.exitCode || edgeModuleReport.exitCode === 0) {
        edgeModuleReportViewModel.exitCode = edgeModuleReport.exitCode;
    }

    if (edgeModuleReport.lastExitTimeUtc) {
        edgeModuleReportViewModel.lastExitTimeUtc = ensureDate(edgeModuleReport.lastExitTimeUtc);
    }

    if (edgeModuleReport.lastRestartTimeUtc) {
        edgeModuleReportViewModel.lastRestartTimeUtc = ensureDate(edgeModuleReport.lastRestartTimeUtc);
    }

    if (edgeModuleReport.lastStartTimeUtc) {
        edgeModuleReportViewModel.lastStartTimeUtc = ensureDate(edgeModuleReport.lastStartTimeUtc);
    }

    if (edgeModuleReport.restartCount || edgeModuleReport.restartCount === 0) {
        edgeModuleReportViewModel.restartCount = edgeModuleReport.restartCount;
    }

    if (edgeModuleReport.restartPolicy) {
        edgeModuleReportViewModel.restartPolicy = edgeModuleReport.restartPolicy;
    }

    if (edgeModuleReport.statusDescription) {
        edgeModuleReportViewModel.statusDescription = edgeModuleReport.statusDescription;
    }

    if (edgeModuleReport.runtimeStatus) {
        edgeModuleReportViewModel.runtimeStatus = edgeModuleReport.runtimeStatus;
    }

    if (edgeModuleReport.settings) {

        if (edgeModuleReport.settings.createOptions) {
            edgeModuleReportViewModel.createOptions = edgeModuleReport.settings.createOptions;
        }

        if (edgeModuleReport.settings.image) {
            edgeModuleReportViewModel.image = edgeModuleReport.settings.image;
        }
    }

    if (edgeModuleReport.status) {
        edgeModuleReportViewModel.status = edgeModuleReport.status;
    }

    if (edgeModuleReport.type) {
        edgeModuleReportViewModel.type = edgeModuleReport.type;
    }

    if (edgeModuleReport.version) {
        edgeModuleReportViewModel.version = edgeModuleReport.version;
    }

    if (edgeModuleReport.env) {
        edgeModuleReportViewModel.environmentVariables = [];
        const env = edgeModuleReport.env;
        Object.keys(edgeModuleReport.env).forEach(key => {
            if (!env[key] ||
                env[key].value === undefined ||
                env[key].value === null) {
                return;
            }

            edgeModuleReportViewModel.environmentVariables.push({
                name: key,
                value: env[key].value
            });
        });
    }

    return edgeModuleReportViewModel;
};
