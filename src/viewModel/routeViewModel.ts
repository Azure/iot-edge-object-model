// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// describes how to render route in layered deployments
export enum RoutePathType {
    memberOfRoutesPath, // render route as part of properties.desired.routes
    standaloneRoutePath // render route as properties.desired.routes.[routeName]
}

export interface RouteViewModel {
    name: string;
    value: string;
    priority?: string;
    timeToLiveSecs?: string;
    routePathType?: RoutePathType;
}
