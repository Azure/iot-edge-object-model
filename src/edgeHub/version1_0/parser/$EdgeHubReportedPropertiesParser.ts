// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeHubReportedPropertiesViewModel } from '../../../viewModel/$EdgeHubReportedPropertiesViewModel';
import { $EdgeHubReportedProperties } from '../model/$EdgeHubReportedProperties';
import { ConnectedClientReport } from '../model/connectedClientReport';
import { ConnectedClientReportViewModel } from '../../../viewModel/connectedClientReportViewModel';
import { ensureDate } from '../../../utilities/parseUtilities';

export const get$EdgeHubReportedPropertiesViewModel = (edgeHubReportedProperties: $EdgeHubReportedProperties): $EdgeHubReportedPropertiesViewModel => {
    const $edgeHubReportedPropertiesViewModel = {
        connectedClients: getConnectedClientReportViewModels(edgeHubReportedProperties)
    };

    return $edgeHubReportedPropertiesViewModel;
};

export const getConnectedClientReportViewModels = (edgeHubReportedProperties: $EdgeHubReportedProperties): ConnectedClientReportViewModel[] => {
    if (!edgeHubReportedProperties.clients) {
        return [];
    }

    const connectedClientReportViewModels = Object.keys(edgeHubReportedProperties.clients)
    .filter(key => !!edgeHubReportedProperties.clients[key])
    .map(key => getConnectedClientReportViewModel(edgeHubReportedProperties.clients[key], key));

    return connectedClientReportViewModels;
};

export const getConnectedClientReportViewModel = (connectedClientReport: ConnectedClientReport, name: string): ConnectedClientReportViewModel => {
    const connectedClientReportViewModel: ConnectedClientReportViewModel = {
        clientId: name,
        lastConnectedTimeUtc: connectedClientReport.lastConnectedTimeUtc ? ensureDate(connectedClientReport.lastConnectedTimeUtc) : null,
        lastDisconnectedTimeUtc: connectedClientReport.lastDisconnectedTimeUtc ? ensureDate(connectedClientReport.lastDisconnectedTimeUtc) : null,
        status: connectedClientReport.status ? connectedClientReport.status : ''
    };

    return connectedClientReportViewModel;
};
