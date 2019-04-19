// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface ConnectedClientReportViewModel {
    clientId: string;
    status: string;
    lastConnectedTimeUtc: Date | null;
    lastDisconnectedTimeUtc: Date | null;
}
