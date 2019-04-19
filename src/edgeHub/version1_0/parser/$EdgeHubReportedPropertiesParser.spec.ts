// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'jest';
import { sample$EdgeHubModuleTwin } from '../../../utilities/testHelpers';
import { get$EdgeHubReportedPropertiesViewModel, getConnectedClientReportViewModels, getConnectedClientReportViewModel } from './$EdgeHubReportedPropertiesParser';

describe('$EdgeHubReportedPropertiesParser', () => {
    describe('get$EdgeHubReportedPropertiesViewModel', () => {
        it('returns view model meeting specifications', () => {
            const edgeHubTwin = sample$EdgeHubModuleTwin();
            const reportedProperties = edgeHubTwin.properties.reported;
            const result = get$EdgeHubReportedPropertiesViewModel(reportedProperties as any);

            expect(result.connectedClients.length).toEqual(2);
            expect(result.connectedClients[0].clientId).toEqual('clientOne');
            expect(result.connectedClients[0].lastConnectedTimeUtc).toBeInstanceOf(Date);
            expect(result.connectedClients[0].lastDisconnectedTimeUtc).toBeInstanceOf(Date);
            expect(result.connectedClients[1].clientId).toEqual('clientTwo');
            expect(result.connectedClients[0].status).toEqual('disconnected');
            expect(result.connectedClients[1].lastConnectedTimeUtc).toBeInstanceOf(Date);
            expect(result.connectedClients[1].lastDisconnectedTimeUtc).toBeInstanceOf(Date);
            expect(result.connectedClients[1].status).toEqual('connected');
        });
    });

    describe('getConnectedClientsViewModels', () => {
        it('returns empty array when connectedClients is not defined', () => {
            const edgeHubTwin = sample$EdgeHubModuleTwin();
            const reportedProperties = edgeHubTwin.properties.reported;
            reportedProperties.clients = null;

            expect(getConnectedClientReportViewModels(reportedProperties as any).length).toEqual(0);
        });
    });

    describe('getConnectedClientViewModel', () => {
        it('does not set lastConnectedTimeUtc when value is undefined', () => {
            const edgeHubTwin = sample$EdgeHubModuleTwin();
            const reportedProperties = edgeHubTwin.properties.reported;
            reportedProperties.clients.clientOne.lastConnectedTimeUtc = null;

            const result = getConnectedClientReportViewModel(reportedProperties.clients.clientOne as any, 'clientOne');
            expect(result.lastConnectedTimeUtc).toBeNull();
        });

        it('does not set lastDisconnectedTimeUtc when value is undefined', () => {
            const edgeHubTwin = sample$EdgeHubModuleTwin();
            const reportedProperties = edgeHubTwin.properties.reported;
            reportedProperties.clients.clientOne.lastDisconnectedTimeUtc = null;

            const result = getConnectedClientReportViewModel(reportedProperties.clients.clientOne as any, 'clientOne');
            expect(result.lastDisconnectedTimeUtc).toBeNull();
        });

        it('does not set status when value is undefined', () => {
            const edgeHubTwin = sample$EdgeHubModuleTwin();
            const reportedProperties = edgeHubTwin.properties.reported;
            reportedProperties.clients.clientOne.status = null;

            const result = getConnectedClientReportViewModel(reportedProperties.clients.clientOne as any, 'clientOne');
            expect(result.status).toEqual('')
        });
    });
});