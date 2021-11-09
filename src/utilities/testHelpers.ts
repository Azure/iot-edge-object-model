// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { $EdgeAgentDesiredPropertiesViewModel } from '../viewModel/$EdgeAgentDesiredPropertiesViewModel';
import { $EdgeHubDesiredPropertiesViewModel } from '../viewModel/$EdgeHubDesiredPropertiesViewModel';
import { $EdgeModuleTwinsViewModel } from '../viewModel/$EdgeModuleTwinsViewModel';
import { $EdgeAgentReportedPropertiesViewModel } from '../viewModel/$EdgeAgentReportedPropertiesViewModel';
import { new$EdgeAgentDesiredPropertiesViewModelWithDefaults } from './viewModelFactory';
import { EdgeAgentModuleSpecificationViewModel } from '../viewModel/edgeAgentModuleSpecificationViewModel';
import { EdgeHubModuleSpecificationViewModel } from '../viewModel/edgeHubModuleSpecificationViewModel';
import { EdgeModuleSpecificationViewModel } from '../viewModel/edgeModuleSpecificationViewModel';
import { EnvironmentVariableValueType } from '../viewModel/environmentVariableViewModel';

export const newEdgeAgentModuleSpecificationViewModel = (): EdgeAgentModuleSpecificationViewModel => {
    return newEdgeModuleSpecificationViewModel() as EdgeAgentModuleSpecificationViewModel;
};

export const newEdgeHubModuleSpecificationViewModel = (): EdgeHubModuleSpecificationViewModel => {
    return {
        createOptions: '',
        environmentVariables: [],
        image: '',
        imagePullPolicy: '',
        name: '',
        restartPolicy: '',
        status: '',
        type: '',
        version: ''
    };
};

export const newEdgeModuleSpecificationViewModel = (): EdgeModuleSpecificationViewModel => {
    return {
        createOptions: '',
        desiredProperties: null,
        environmentVariables: [],
        image: '',
        imagePullPolicy: '',
        name: '',
        restartPolicy: '',
        status: '',
        type: '',
        version: ''
    };
};

export const sampleEdgeModuleTwinsViewModel = (): $EdgeModuleTwinsViewModel => {
    return {
        $edgeAgent: {
            configurations: [],
            desiredPropertiesViewModel: sample$EdgeAgentDesiredPropertiesViewModel(),
            reportedPropertiesViewModel: sample$EdgeAgentReportedPropertiesViewModel()
        },
        $edgeHub: {
            desiredPropertiesViewModel: sample$EdgeHubDesiredPropertiesViewModel(),
            reportedPropertiesViewModel: {
                connectedClients: []
            }
        }
    };
};

export const sample$EdgeHubDesiredPropertiesViewModel = (): $EdgeHubDesiredPropertiesViewModel => {
    return {
        mqttBroker: '',
        routeViewModels: [{
            name: 'routeName',
            value: 'routeValue'
        }],
        schemaVersion: '1.0',
        storeAndForwardTimeToLive: 2
    };
};

export const sample$EdgeAgentDesiredPropertiesViewModel = (): $EdgeAgentDesiredPropertiesViewModel => {

    const vm = new$EdgeAgentDesiredPropertiesViewModelWithDefaults();
    vm.edgeAgentModuleSpecificationViewModel = newEdgeAgentModuleSpecificationViewModel();
    vm.edgeAgentModuleSpecificationViewModel.createOptions = '{}';
    vm.edgeAgentModuleSpecificationViewModel.environmentVariables.push(
        {
            name: 'edgeAgentEnv1',
            value: 'edgeAgentEnv1Value',
            valueType: EnvironmentVariableValueType.string
        }
    );

    vm.edgeAgentModuleSpecificationViewModel.image = 'http://agentImage';
    vm.edgeAgentModuleSpecificationViewModel.type = 'docker';
    vm.edgeAgentModuleSpecificationViewModel.version = '1.0';

    vm.edgeHubModuleSpecificationViewModel = newEdgeHubModuleSpecificationViewModel();
    vm.edgeHubModuleSpecificationViewModel.createOptions = '{}';
    vm.edgeHubModuleSpecificationViewModel.startupOrder = '0';
    vm.edgeHubModuleSpecificationViewModel.environmentVariables.push(
        {
            name: 'edgeHubEnv1',
            value: 'edgeHubEnv1Value',
            valueType: EnvironmentVariableValueType.string
        }
    );
    vm.edgeHubModuleSpecificationViewModel.image = 'http://hubImage';
    vm.edgeHubModuleSpecificationViewModel.restartPolicy = 'always';
    vm.edgeHubModuleSpecificationViewModel.status = 'started';
    vm.edgeHubModuleSpecificationViewModel.type = 'docker';
    vm.edgeHubModuleSpecificationViewModel.version = '1.0';

    vm.loggingOptions = 'loggingOptions';
    vm.minDockerVersion = 'v1.25';
    vm.registryCredentials.push({
        address: 'reg1Address',
        name: 'reg1',
        password: 'reg1Password',
        username: 'reg1UserName'
    });
    vm.runtimeType = 'runtimeType';
    vm.schemaVersion = '1.0';

    const moduleSpecification = newEdgeModuleSpecificationViewModel();
    moduleSpecification.startupOrder = '1';
    moduleSpecification.createOptions = '{}';
    moduleSpecification.desiredProperties = {
        desiredProperty: {
            name: 'desiredPropertyName',
            value: 'desiredPropertyValue'
        }
    };
    moduleSpecification.environmentVariables.push({
        name: 'moduleEnv1',
        value: 'moduleEnv1Value',
        valueType: EnvironmentVariableValueType.string
    });
    moduleSpecification.image = 'http://moduleImage';
    moduleSpecification.imagePullPolicy = 'never';
    moduleSpecification.name = 'moduleName1';
    moduleSpecification.restartPolicy = 'always';
    moduleSpecification.status = 'started';
    moduleSpecification.type = 'docker';
    moduleSpecification.version = '1.0';
    moduleSpecification.desiredProperties = {
        'properties.desired': {
            hello: 'world'
        }
    };

    vm.moduleSpecificationViewModels.push(moduleSpecification);
    return vm;
};

export const sample$EdgeAgentReportedPropertiesViewModel = (): $EdgeAgentReportedPropertiesViewModel => {
    return {
        edgeAgentModuleReportViewModel: {
            createOptions: 'agentCreateOptions',
            environmentVariables: [],
            exitCode: 0,
            image: 'http://agentImage',
            lastExitTimeUtc: null,
            lastRestartTimeUtc: null,
            lastStartTimeUtc: null,
            name: 'edgeAgent',
            restartCount: 2,
            restartPolicy: 'always',
            runtimeStatus: 'runtimeStatus',
            status: 'reportedStatus',
            statusDescription: 'status description',
            type: 'docker',
            version: '1.1'
        },
        edgeHubModuleReportViewModel: {
            createOptions: 'hubCreateOptions',
            environmentVariables: [],
            exitCode: 10,
            image: 'http://hubImage',
            lastExitTimeUtc: null,
            lastRestartTimeUtc: null,
            lastStartTimeUtc: null,
            name: 'edgeHub',
            restartCount: 2,
            restartPolicy: 'always',
            runtimeStatus: 'runtimeStatusHub',
            startUpOrder: '0',
            status: 'reportedStatus',
            statusDescription: 'status description',
            type: 'docker',
            version: '1.1'
        },
        edgeModuleReportViewModels: [{
            createOptions: 'sampleCreateOptions',
            environmentVariables: [],
            exitCode: 1,
            image: 'http://immage',
            lastExitTimeUtc: null,
            lastRestartTimeUtc: null,
            lastStartTimeUtc: null,
            name: 'notModuleName1',
            restartCount: 2,
            restartPolicy: 'always',
            runtimeStatus: 'runtimeStatusModule',
            startUpOrder: '1',
            status: 'reportedStatus',
            statusDescription: 'status description',
            type: 'docker',
            version: '1.0'
        }],
        runtimeResponseCode: 0
    };
};

export const sampleConfigurationContent = () => {
    const edgeHubCreateOptions = '{\n  \'Env\': [\n    \'EnvironmentVariable=SomeValue1\'\n  ]\n}';
    const edgeHubCreateImage = 'microsoft/azureiotedge-hub:1.0-preview';
    const edgeHubCreateTimeToLiveSecs = 0;
    const moduleVersion = '1.0';
    const moduleStatus = 'running';
    const moduleRestartPolicy = 'always';
    const moduleType = 'docker';
    const moduleImage = 'testImage';
    const moduleCreateOptions = '{\'key\':\'value\'}';
    const routes = {
        route: 'FROM /* INTO $upstream'
    };

    return {
        modulesContent: {
            $edgeAgent: {
                'properties.desired': {
                    modules: {
                        moduleName1: {
                            configuration: {
                                id: 'configuration1'
                            },
                            env: {
                                edgeCustomModuleVar1: {
                                    value: 'edgeCustomModuleVar1Value'
                                }
                            },
                            restartPolicy: moduleRestartPolicy,
                            status: moduleStatus,

                            settings: {
                                createOptions: moduleCreateOptions,
                                image: moduleImage
                            },
                            type: moduleType,
                            version: moduleVersion,
                        }
                    },
                    runtime: {
                        settings: {
                            loggingOptions: '',
                            minDockerVersion: 'v1.25',
                            registryCredentials : {
                                reg1: {
                                    address: 'address1',
                                    password: 'password1',
                                    username: 'username1'
                                }
                            }
                        },
                        type: 'docker',
                    },
                    schemaVersion: '1.1',
                    systemModules: {
                        edgeAgent: {
                            configuration: {
                                id: 'configuration1'
                            },
                            env: {
                                edgeAgentVar1: {
                                    value: 'edgeAgentVar1Value'
                                }
                            },
                            settings: {
                                createOptions: '{}',
                                image: 'microsoft/azureiotedge-agent:1.0-preview'
                            },
                            type: 'docker',
                            version: '1.0'
                        },
                        edgeHub: {
                            configuration: {
                                id: 'configuration1'
                            },
                            env: {
                                edgeHubVar1: {
                                    value: 'edgeHubVar1Value'
                                }
                            },
                            restartPolicy: 'always',
                            settings: {
                                createOptions: edgeHubCreateOptions,
                                image: edgeHubCreateImage,
                            },
                            status: 'running',
                            type: 'docker',
                        }
                    },

                }
            },
            $edgeHub: {
                'properties.desired': {
                    mqttBroker: {"bridges": [], "authorizations": []},
                    routes,
                    schemaVersion: '1.1',
                    storeAndForwardConfiguration: {
                        timeToLiveSecs: edgeHubCreateTimeToLiveSecs
                    }
                }
            },
            moduleName1: {
                'properties.desired': {
                    hello: 'world'
                }
            }
        }
    };
};

export const sample$EdgeAgentModuleTwin = () => {
    const edgeAgentModule = {
        authenticationType: 'none',
        cloudToDeviceMessageCount: 0,
        configurations: {
            myConfiguration: {
                status: 'Applied'
            }
        },
        connectionState: 'Disconnected',
        deviceId: 'testDevice',
        etag: 'AAAAAAAAAAI=',
        lastActivityTime: '0001-01-01T00:00:00',
        moduleId: '$edgeAgent',
        properties: {
            desired: {
                modules: {
                    tempSensor: {
                        env: {
                            edgeCustomModuleVar1: {
                                value: 'edgeCustomModuleVar1Value'
                            }
                        },
                        imagePullPolicy: 'never',
                        restartPolicy: 'always',
                        settings: {
                            createOptions: '{\'key\':\'value\'}',
                            image: 'mcr/azureiotedge-simulated-temperature-sensor:1.0-preview',
                        },
                        startupOrder: 1,
                        status: 'running',
                        type: 'docker',
                        version: '1.0',
                    }
                },
                runtime: {
                    settings: {
                        loggingOptions: 'loggingOption',
                        minDockerVersion: 'v1.25',
                        registryCredentials: {
                            credential1: {
                                address: 'address1',
                                password: 'password1',
                                username: 'username1'
                            }
                        }
                    },
                    type: 'docker',
                },
                schemaVersion: '1.0',
                systemModules: {
                    edgeAgent: {
                        env: {
                            edgeAgentVar1: {
                                value: 'edgeAgentVar1Value'
                            }
                        },
                        settings: {
                            createOptions: '{}',
                            image: 'mcr/azureiotedge-agent:1.0-preview',
                        },
                        type: 'docker',
                        version: '1.0'
                    },
                    edgeHub: {
                        env: {
                            edgeHubVar1: {
                                value: 'edgeHubVar1Value'
                            }
                        },
                        restartPolicy: 'always',
                        settings: {
                            createOptions: JSON.stringify({ Env: 'value'}),
                            image: 'mcr/azureiotedge-hub:1.0-preview',
                        },
                        startupOrder: 1,
                        status: 'running',
                        type: 'docker'
                    }
                },

                $metadata: {
                    $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                    $lastUpdatedVersion: 2,
                    modules: {
                        $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                        $lastUpdatedVersion: 2,
                        tempSensor: {
                            $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                            $lastUpdatedVersion: 2,
                            restartPolicy: {
                                $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                $lastUpdatedVersion: 2
                            },
                            settings: {
                                $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                $lastUpdatedVersion: 2,
                                createOptions: {
                                    $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                    $lastUpdatedVersion: 2
                                },
                                image: {
                                    $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                    $lastUpdatedVersion: 2
                                },
                            },
                            status: {
                                $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                $lastUpdatedVersion: 2
                            },
                            type: {
                                $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                $lastUpdatedVersion: 2
                            },
                            version: {
                                $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                $lastUpdatedVersion: 2
                            }
                        }
                    },
                    runtime: {
                        $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                        $lastUpdatedVersion: 2,
                        settings: {
                            $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                            $lastUpdatedVersion: 2,
                            loggingOptions: {
                                $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                $lastUpdatedVersion: 2
                            },
                            minDockerVersion: {
                                $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                $lastUpdatedVersion: 2
                            },
                        },
                        type: {
                            $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                            $lastUpdatedVersion: 2
                        },
                    },
                    schemaVersion: {
                        $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                        $lastUpdatedVersion: 2
                    },
                    systemModules: {
                        $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                        $lastUpdatedVersion: 2,
                        edgeAgent: {
                            $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                            $lastUpdatedVersion: 2,
                            settings: {
                                $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                $lastUpdatedVersion: 2,
                                createOptions: {
                                    $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                    $lastUpdatedVersion: 2
                                },
                                image: {
                                    $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                    $lastUpdatedVersion: 2
                                },
                            },
                            type: {
                                $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                $lastUpdatedVersion: 2
                            }
                        },
                        edgeHub: {
                            $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                            $lastUpdatedVersion: 2,
                            restartPolicy: {
                                $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                $lastUpdatedVersion: 2
                            },
                            settings: {
                                $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                $lastUpdatedVersion: 2,
                                createOptions: {
                                    $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                    $lastUpdatedVersion: 2
                                },
                                image: {
                                    $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                    $lastUpdatedVersion: 2
                                },
                            },
                            status: {
                                $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                $lastUpdatedVersion: 2
                            },
                            type: {
                                $lastUpdated: '2018-03-14T14:26:46.2987369Z',
                                $lastUpdatedVersion: 2
                            }
                        }
                    },

                },
                $version: 2
            },
            reported: {
                $metadata: {
                    $lastUpdated: '2018-03-13T22:53:52.2275407Z',
                    lastDesiredStatus: {
                        $lastUpdated: '2018-03-13T22:53:52.2275407Z',
                        code: {
                            $lastUpdated: '2018-03-13T22:53:52.2275407Z'
                        },
                        description: {
                            $lastUpdated: '2018-03-13T22:53:52.2275407Z'
                        }
                    },
                    lastDesiredVersion: {
                        $lastUpdated: '2018-03-13T22:53:52.2275407Z'
                    },
                    runtime: {
                        $lastUpdated: '2018-03-13T22:53:52.2275407Z',
                        platform: {
                            $lastUpdated: '2018-03-13T22:53:52.2275407Z',
                            architecture: {
                                $lastUpdated: '2018-03-13T22:53:52.2275407Z'
                            },
                            os: {
                                $lastUpdated: '2018-03-13T22:53:52.2275407Z'
                            },
                        },
                        type: {
                            $lastUpdated: '2018-03-13T22:53:52.2275407Z'
                        }
                    },
                    schemaVersion: {
                        $lastUpdated: '2018-03-13T22:53:52.2275407Z'
                    },
                    systemModules: {
                        $lastUpdated: '2018-03-13T22:53:52.2275407Z',
                        edgeAgent: {
                            $lastUpdated: '2018-03-13T22:53:52.2275407Z',
                            lastStartTimeUtc: {
                                $lastUpdated: '2018-03-13T22:53:52.2275407Z'
                            },
                            runtimeStatus: {
                                $lastUpdated: '2018-03-13T22:53:52.2275407Z'
                            },
                            settings: {
                                $lastUpdated: '2018-03-13T22:53:52.2275407Z',
                                createOptions: {
                                    $lastUpdated: '2018-03-13T22:53:52.2275407Z'
                                },
                                image: {
                                    $lastUpdated: '2018-03-13T22:53:52.2275407Z'
                                },
                                imageHash: {
                                    $lastUpdated: '2018-03-13T22:53:52.2275407Z'
                                },
                            },
                            type: {
                                $lastUpdated: '2018-03-13T22:53:52.2275407Z'
                            }
                        }
                    },
                    version: {
                        $lastUpdated: '2018-03-13T22:53:52.2275407Z',
                        build: {
                            $lastUpdated: '2018-03-13T22:53:52.2275407Z'
                        },
                        commit: {
                            $lastUpdated: '2018-03-13T22:53:52.2275407Z'
                        },
                        version: {
                            $lastUpdated: '2018-03-13T22:53:52.2275407Z'
                        }
                    },

                },
                $version: 2,
                deviceHealth: 'healthy',
                lastDesiredStatus: {
                    code: 417,
                    description: 'This device has an empty configuration for the edge agent. Please set a deployment manifest.'
                },
                lastDesiredVersion: 1,
                schemaVersion: '1.0',
                systemModules: {
                    edgeAgent: {
                        lastStartTimeUtc: '2018-03-13T22:53:49.9587114Z',
                        runtimeStatus: 'running',
                        settings: {
                            createOptions: '{}',
                            image: 'mcr/azureiotedge-agent:1.0-preview',
                            imageHash: 'sha256:a604f2d8d15f15d9f2b75049d8721e596975babdb00cb0ee81bd4ae351625b53'
                        },
                        type: 'docker',
                    },
                    edgeHub: {
                        restartPolicy: 'always',
                        settings: {
                            createOptions: JSON.stringify({ Env: 'value'}),
                            image: 'mcr/azureiotedge-hub:1.0-preview1',

                        },
                        status: 'running',
                        statusDescription: 'created',
                        type: 'docker'
                    }
                },
                version: {
                    build: '10543704',
                    commit: 'c87b52c93b13f03bf34da8d9ae650d55368ccecb',
                    version: '1.0.0-preview021'
                },

                modules: {
                    tempSensor: {
                        configuration: {
                            id: 'config1'
                        },
                        env: {
                            mySetting: {
                                value: 'mySettingValue'
                            }
                        },
                        exitCode: 139,
                        lastExitTimeUtc: '2018-03-21T04:55:37.2122345Z',
                        lastRestartTimeUtc: '2018-03-21T04:51:35.6779779Z',
                        lastStartTimeUtc: '2018-03-21T04:51:36.7685743Z',
                        restartCount: 0,
                        restartPolicy: 'always',
                        runtimeStatus: 'failed',
                        settings: {
                            createOptions: '{}',
                            image: 'mcr/azureiotedge-simulated-temperature-sensor:1.0-preview',
                            imageHash: 'sha256:e33fcbbfa1b0d75d4faf5094fc8403c97812691c6eb4c5334222ba098dc38eb2',
                        },
                        startupOrder: 1,
                        status: 'running',
                        statusDescription: 'exited',
                        type: 'docker',
                        version: '1.0'
                    }
                },
                runtime: {
                    platform: {
                        architecture: 'x86_64',
                        os: 'linux'
                    },
                    type: 'Unknown'
                },
            }
        },
        status: 'enabled',
        statusUpdateTime: '0001-01-01T00:00:00',
        version: 4,
        x509Thumbprint: {
            primaryThumbprint: 'primaryThumbprint',
            secondaryThumbprint: 'secondaryThumbprint'
        },
    };

    return edgeAgentModule;
};

export const sample$EdgeHubModuleTwin = () => {
    const edgeHubModule = {
        authenticationType: 'none',
        cloudToDeviceMessageCount: 0,
        connectionState: 'Disconnected',
        deviceId: 'testDevice',
        etag: 'AAAAAAAAAAI=',
        lastActivityTime: '0001-01-01T00:00:00',
        moduleId: '$edgeHub',
        properties: {
            desired: {
                $metadata: {
                    $lastUpdated: '2018-03-14T14:26:46.3143625Z',
                    $lastUpdatedVersion: 2,
                    routes: {
                        $lastUpdated: '2018-03-14T14:26:46.3143625Z',
                        $lastUpdatedVersion: 2,
                        route: {
                            $lastUpdated: '2018-03-14T14:26:46.3143625Z',
                            $lastUpdatedVersion: 2
                        }
                    },
                    schemaVersion: {
                        $lastUpdated: '2018-03-14T14:26:46.3143625Z',
                        $lastUpdatedVersion: 2
                    },
                    storeAndForwardConfiguration: {
                        $lastUpdated: '2018-03-14T14:26:46.3143625Z',
                        $lastUpdatedVersion: 2,
                        timeToLiveSecs: {
                            $lastUpdated: '2018-03-14T14:26:46.3143625Z',
                            $lastUpdatedVersion: 2
                        }
                    }
                },
                $version: 2,
                routes: {
                    route: 'FROM /* INTO $upstream'
                },
                schemaVersion: '1.0',
                storeAndForwardConfiguration: {
                    timeToLiveSecs: 1200
                },
            },
            reported: {
                $metadata: {
                    $lastUpdated: '0001-01-01T00:00:00Z'
                },
                $version: 1,
                clients: {
                    clientOne: {
                        lastConnectedTimeUtc: '2018-03-14T14:26:46.3143625Z',
                        lastDisconnectedTimeUtc: '2018-03-14T14:26:46.3143625Z',
                        status: 'disconnected'
                    },
                    clientTwo: {
                        lastConnectedTimeUtc: '2018-03-14T14:26:46.3143625Z',
                        lastDisconnectedTimeUtc: '2018-03-14T14:26:46.3143625Z',
                        status: 'connected'
                    }
                }
            }
        },
        status: 'enabled',
        statusUpdateTime: '0001-01-01T00:00:00',
        version: 3,
        x509Thumbprint: {
            primaryThumbprint: '',
            secondaryThumbprint: ''
        },
    };

    return edgeHubModule;
};
