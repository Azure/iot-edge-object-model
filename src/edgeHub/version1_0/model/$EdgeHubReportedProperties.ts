// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ConnectedClientReport } from './connectedClientReport';
import { StringMap } from '../../../utilities/stringMap';

export interface $EdgeHubReportedProperties {
    schemaVersion: string;
    clients: StringMap<ConnectedClientReport>;
}
