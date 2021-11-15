// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface $EdgeHubDesiredProperties {
    schemaVersion: string;
    routes: object | null;
    storeAndForwardConfiguration: {
        timeToLiveSecs: number | null;
    };
    mqttBroker?: object | string;
}
