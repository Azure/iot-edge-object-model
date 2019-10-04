// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeModuleTwinsViewModel } from '../viewModel/$EdgeModuleTwinsViewModel';
import { EdgeConfigurationContentViewModel } from '../viewModel/edgeConfigurationContentViewModel';
import { EdgeAgentModuleSpecificationViewModel } from '../viewModel/edgeAgentModuleSpecificationViewModel';
import { EdgeHubModuleSpecificationViewModel } from '../viewModel/edgeHubModuleSpecificationViewModel';
import { EdgeModuleSpecificationViewModel } from '../viewModel/edgeModuleSpecificationViewModel';
import { EdgeModuleReportViewModel } from '../viewModel/edgeModuleReportViewModel';
import { EdgeModuleType, EdgeModuleViewModel } from '../viewModel/edgeModuleViewModel';
import { $EdgeHubDesiredPropertiesViewModel } from '../viewModel/$EdgeHubDesiredPropertiesViewModel';
import {
    new$EdgeAgentDesiredPropertiesViewModelWithDefaults,
    new$EdgeHubDesiredPropertiesViewModelWithDefaults } from './viewModelFactory';
import { StringMap } from './stringMap';

const blankEntry = '--';

export const convertToEdgeConfigurationContentViewModel = (edgeModuleTwinsViewModel: $EdgeModuleTwinsViewModel): EdgeConfigurationContentViewModel => {

    const $edgeAgentDesiredPropertiesViewModel = (
        edgeModuleTwinsViewModel &&
        edgeModuleTwinsViewModel.$edgeAgent &&
        edgeModuleTwinsViewModel.$edgeAgent.desiredPropertiesViewModel) ?
            edgeModuleTwinsViewModel.$edgeAgent.desiredPropertiesViewModel :
            new$EdgeAgentDesiredPropertiesViewModelWithDefaults();

    const $edgeHubDesiredPropertiesViewModel: $EdgeHubDesiredPropertiesViewModel = (
        edgeModuleTwinsViewModel &&
        edgeModuleTwinsViewModel.$edgeHub &&
        edgeModuleTwinsViewModel.$edgeHub.desiredPropertiesViewModel) ?
            edgeModuleTwinsViewModel.$edgeHub.desiredPropertiesViewModel :
            new$EdgeHubDesiredPropertiesViewModelWithDefaults();

    const edgeConfigurationContentViewModel = {
        $edgeAgentDesiredPropertiesViewModel,
        $edgeHubDesiredPropertiesViewModel,
    };

    return edgeConfigurationContentViewModel;
};

export const convertToEdgeModuleViewModels = (edgeModuleTwinsViewModel: $EdgeModuleTwinsViewModel): EdgeModuleViewModel[] => {

    const systemModules: EdgeModuleViewModel[] = [];

    const edgeAgentModuleEntry = getEdgeAgentModuleEntry(edgeModuleTwinsViewModel);
    if (edgeAgentModuleEntry) {
        systemModules.push(edgeAgentModuleEntry);
    }

    const edgeHubModuleEntry = getEdgeHubModuleEntry(edgeModuleTwinsViewModel);
    if (edgeHubModuleEntry) {
        systemModules.push(edgeHubModuleEntry);
    }

    const moduleMap: StringMap<EdgeModuleViewModel> = {};

    const reportedModules = getReportedModules(edgeModuleTwinsViewModel);
    reportedModules.forEach(moduleReport => {
        moduleMap[moduleReport.name] = {
            desired: null,
            displayName: moduleReport.name,
            exitCode: moduleReport.exitCode !== null && moduleReport.exitCode !== undefined ? moduleReport.exitCode.toString() : blankEntry,
            lastStartTimeUtc: moduleReport.lastStartTimeUtc,
            listedOnDevice: true,
            listedOnEdgeAgent: false,
            moduleType: EdgeModuleType.customModule,
            name: moduleReport.name,
            reported: moduleReport,
            runtimeStatus: !!moduleReport && !!moduleReport.runtimeStatus ? moduleReport.runtimeStatus : blankEntry,
        };
    });

    const desiredModules = getDesiredModules(edgeModuleTwinsViewModel);
    desiredModules.forEach(moduleSpecification => {

        if (!moduleMap[moduleSpecification.name]) {
            moduleMap[moduleSpecification.name] = {
                desired: moduleSpecification,
                displayName: moduleSpecification.name,
                exitCode: blankEntry,
                lastStartTimeUtc: null,
                listedOnDevice: false,
                listedOnEdgeAgent: true,
                moduleType: EdgeModuleType.customModule,
                name: moduleSpecification.name,
                reported: null,
                runtimeStatus: blankEntry,
            };
        }
        else {
            moduleMap[moduleSpecification.name].listedOnEdgeAgent = true;
            moduleMap[moduleSpecification.name].desired = moduleSpecification;
        }
    });

    const customModules = Object.keys(moduleMap).map(moduleSpecification => moduleMap[moduleSpecification]);
    return [
        ...systemModules,
        ...customModules
    ];
};

export const getDesiredModules = (edgeModuleTwins: $EdgeModuleTwinsViewModel): EdgeModuleSpecificationViewModel[] => {

    if (!edgeModuleTwins ||
        !edgeModuleTwins.$edgeAgent ||
        !edgeModuleTwins.$edgeAgent.desiredPropertiesViewModel ||
        !edgeModuleTwins.$edgeAgent.desiredPropertiesViewModel.moduleSpecificationViewModels) {
            return [];
    }

    return edgeModuleTwins.$edgeAgent.desiredPropertiesViewModel.moduleSpecificationViewModels;
};

export const getReportedModules = (edgeModuleTwins: $EdgeModuleTwinsViewModel): EdgeModuleReportViewModel[] => {

    if (!edgeModuleTwins ||
        !edgeModuleTwins.$edgeAgent ||
        !edgeModuleTwins.$edgeAgent.reportedPropertiesViewModel ||
        !edgeModuleTwins.$edgeAgent.reportedPropertiesViewModel.edgeAgentModuleReportViewModel) {
            return [];
    }

    return edgeModuleTwins.$edgeAgent.reportedPropertiesViewModel.edgeModuleReportViewModels;
};

export const  getEdgeAgentModuleEntry = (edgeModuleTwins: $EdgeModuleTwinsViewModel): EdgeModuleViewModel | null => {

    if (!edgeModuleTwins ||
        !edgeModuleTwins.$edgeAgent) {
            return null;
    }

    let edgeAgentModuleSpecification: EdgeAgentModuleSpecificationViewModel | null = null;
    let edgeAgentModuleReport: EdgeModuleReportViewModel | null = null;
    let moduleName: string  = '';

    if (edgeModuleTwins.$edgeAgent.desiredPropertiesViewModel &&
        edgeModuleTwins.$edgeAgent.desiredPropertiesViewModel.edgeAgentModuleSpecificationViewModel) {

        edgeAgentModuleSpecification = edgeModuleTwins.$edgeAgent.desiredPropertiesViewModel.edgeAgentModuleSpecificationViewModel;
        moduleName = edgeAgentModuleSpecification.name;
    }

    if (edgeModuleTwins.$edgeAgent.reportedPropertiesViewModel &&
        edgeModuleTwins.$edgeAgent.reportedPropertiesViewModel.edgeAgentModuleReportViewModel) {

        edgeAgentModuleReport = edgeModuleTwins.$edgeAgent.reportedPropertiesViewModel.edgeAgentModuleReportViewModel;
        moduleName = edgeAgentModuleReport.name;
    }

    if (edgeAgentModuleSpecification || edgeAgentModuleReport) {
        const moduleEntry: EdgeModuleViewModel = {
            desired: edgeAgentModuleSpecification ? {
                createOptions:  edgeAgentModuleSpecification.createOptions,
                desiredProperties: null,
                environmentVariables: edgeAgentModuleSpecification.environmentVariables,
                image: edgeAgentModuleSpecification.image,
                imagePullPolicy: edgeAgentModuleSpecification.imagePullPolicy,
                name: edgeAgentModuleSpecification.name,
                restartPolicy: '',
                status: '',
                type: edgeAgentModuleSpecification.type,
                version: edgeAgentModuleSpecification.version
            } : null,
            displayName: '$' + moduleName,
            exitCode: edgeAgentModuleReport && edgeAgentModuleReport.exitCode !== null && edgeAgentModuleReport.exitCode !== undefined ? edgeAgentModuleReport.exitCode.toString() : blankEntry,
            lastStartTimeUtc: edgeAgentModuleReport ? edgeAgentModuleReport.lastStartTimeUtc : null,
            listedOnDevice: !!edgeAgentModuleReport,
            listedOnEdgeAgent: !!edgeAgentModuleSpecification,
            moduleType: EdgeModuleType.systemModule,
            name: moduleName,
            reported: edgeAgentModuleReport,
            runtimeStatus: edgeAgentModuleReport && edgeAgentModuleReport.runtimeStatus ? edgeAgentModuleReport.runtimeStatus : blankEntry,
        };

        return moduleEntry;
    } else {
        return null;
    }
};

export const getEdgeHubModuleEntry = (edgeModuleTwins: $EdgeModuleTwinsViewModel): EdgeModuleViewModel | null => {

    if (!edgeModuleTwins ||
        !edgeModuleTwins.$edgeAgent) {
            return null;
    }

    let edgeHubModuleSpecification: EdgeHubModuleSpecificationViewModel  | null = null;
    let edgeHubModuleReport: EdgeModuleReportViewModel | null  = null;
    let moduleName: string = '';

    if (edgeModuleTwins.$edgeAgent.desiredPropertiesViewModel &&
        edgeModuleTwins.$edgeAgent.desiredPropertiesViewModel.edgeHubModuleSpecificationViewModel) {

        edgeHubModuleSpecification = edgeModuleTwins.$edgeAgent.desiredPropertiesViewModel.edgeHubModuleSpecificationViewModel;
        moduleName = edgeHubModuleSpecification.name;
    }

    if (edgeModuleTwins.$edgeAgent.reportedPropertiesViewModel &&
        edgeModuleTwins.$edgeAgent.reportedPropertiesViewModel.edgeHubModuleReportViewModel) {

        edgeHubModuleReport = edgeModuleTwins.$edgeAgent.reportedPropertiesViewModel.edgeHubModuleReportViewModel;
        moduleName = edgeHubModuleReport.name;
    }

    if (edgeHubModuleSpecification || edgeHubModuleReport) {
        const moduleEntry: EdgeModuleViewModel = {
            desired: edgeHubModuleSpecification ?  {
                createOptions:  edgeHubModuleSpecification.createOptions,
                desiredProperties: null,
                environmentVariables: edgeHubModuleSpecification.environmentVariables,
                image: edgeHubModuleSpecification.image,
                imagePullPolicy: edgeHubModuleSpecification.imagePullPolicy,
                name: edgeHubModuleSpecification.name,
                restartPolicy: edgeHubModuleSpecification.restartPolicy,
                status: edgeHubModuleSpecification.status,
                type: edgeHubModuleSpecification.type,
                version: edgeHubModuleSpecification.version
            } : null,
            displayName: '$' + moduleName,
            exitCode: edgeHubModuleReport && edgeHubModuleReport.exitCode !== null && edgeHubModuleReport.exitCode !== undefined ? edgeHubModuleReport.exitCode.toString() : blankEntry,
            lastStartTimeUtc: !!edgeHubModuleReport ? edgeHubModuleReport.lastStartTimeUtc : null,
            listedOnDevice: !!edgeHubModuleReport,
            listedOnEdgeAgent: !!edgeHubModuleSpecification,
            moduleType: EdgeModuleType.systemModule,
            name: moduleName,
            reported: edgeHubModuleReport,
            runtimeStatus: edgeHubModuleReport && edgeHubModuleReport.runtimeStatus ? edgeHubModuleReport.runtimeStatus : blankEntry,
        };
        return moduleEntry;
    } else {
        return null;
    }
};
