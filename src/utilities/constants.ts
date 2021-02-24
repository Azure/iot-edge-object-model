// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export const CREATE_OPTIONS_CHUNK_SIZE: number = 512;
export const CREATE_OPTIONS_SIZE_LIMIT: number = 4096;
export const OLD_AGENT_VERSION = '1.0.3';
export const DEFAULT_AGENT_IMAGE_URI = 'mcr.microsoft.com/azureiotedge-agent';
export const DEFAULT_RESTART_POLICY = 'always';
export const DEFAULT_DESIRED_STATUS = 'running';
export const DEFAULT_MODULE_TYPE = 'docker';
export const $EDGE_AGENT = {
    DEFAULT_MODULE_VERSION: '1.0',
    EDGE_AGENT: {
        CREATE_OPTIONS: '',
        IMAGE: 'mcr.microsoft.com/azureiotedge-agent:1.1',
        NAME: 'edgeAgent',
        TYPE: 'docker',
        VERSION: '1.0',
    },
    EDGE_HUB: {
        CREATE_OPTIONS: JSON.stringify({
            HostConfig: {
                PortBindings: {
                    '443/tcp': [
                        {
                            HostPort: '443'
                        }
                    ],
                    '5671/tcp': [
                        {
                            HostPort: '5671'
                        }
                    ],
                    '8883/tcp': [
                        {
                            HostPort: '8883'
                        }
                    ],
                }
            }
        }),
        IMAGE: 'mcr.microsoft.com/azureiotedge-hub:1.1',
        NAME: 'edgeHub',
        RESTART_POLICY: 'always',
        STATUS: 'running',
        TYPE: 'docker',
    },
    LOGGING_OPTIONS: '',
    MIN_DOCKER_VERSION: 'v1.25',
    RUNTIME_TYPE: 'docker',
    SCHEMA_VERSION_1_0: '1.0',
};
export const $EDGE_HUB = {
    ROUTES: [{
        name: 'route',
        value: 'FROM /messages/* INTO $upstream'
    }],
    SCHEMA_VERSION_1_0: '1.0',
    STORE_AND_FORWARD_TIME_TO_LIVE: 7200,
};

export const PATHS = {
    $EDGE_AGENT: '$edgeAgent',
    $EDGE_HUB: '$edgeHub',
    ADDRESS: 'address',
    CREATE_OPTIONS: 'createOptions',
    DESIRED: 'desired',
    DESIRED_PROPERTIES: 'properties.desired',
    EDGE_AGENT: 'edgeAgent',
    EDGE_HUB: 'edgeHub',
    ENV: 'env',
    ID: 'id',
    IMAGE: 'image',
    LOGGING_OPTIONS: 'loggingOptions',
    MIN_DOCKER_VERSION: 'minDockerVersion',
    MODULES: 'modules',
    PASSWORD: 'password',
    PROPERTIES: 'properties',
    REGISTRY_CREDENTIALS: 'registryCredentials',
    REPORTED: 'reported',
    RESTART_POLICY: 'restartPolicy',
    ROUTES: 'routes',
    RUNTIME: 'runtime',
    SCHEMA_VERSION: 'schemaVersion',
    SETTINGS: 'settings',
    STATUS: 'status',
    STORE_FORWARD_CONFIGURATION: 'storeAndForwardConfiguration',
    SYSTEM_MODULES: 'systemModules',
    TIME_TO_LIVE_SECONDS: 'timeToLiveSecs',
    TYPE: 'type',
    USERNAME: 'username',
    VALUE: 'value',
    VERSION: 'version',
};
