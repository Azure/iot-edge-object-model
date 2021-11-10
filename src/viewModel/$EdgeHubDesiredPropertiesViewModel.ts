// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RouteViewModel } from './routeViewModel';

export interface $EdgeHubDesiredPropertiesViewModel {
    schemaVersion: string;
    routeViewModels: RouteViewModel[];
    storeAndForwardTimeToLive: number | null;
    mqttBroker?: string;
}
