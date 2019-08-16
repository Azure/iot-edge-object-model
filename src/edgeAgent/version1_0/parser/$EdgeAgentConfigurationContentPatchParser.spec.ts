// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { filterRegistryCredentials, filterModules, get$EdgeAgentPatchEntries } from './$EdgeAgentConfigurationContentPatchParser';

describe('get$EdgeAgentPatchEntries', () => {
    it('returns specified object when $edgeAgent parameters is undefined', () => {
        expect(get$EdgeAgentPatchEntries(undefined, {})).toEqual({
            additionalEdgeAgentEntries: {},
            moduleSpecificationViewModels: [],
            registryCredentials: []
        });
    });

    it('returns specified object when $edgeAgent has no properties', () => {
        expect(get$EdgeAgentPatchEntries({}, {})).toEqual({
            additionalEdgeAgentEntries: {},
            moduleSpecificationViewModels: [],
            registryCredentials: []
        });
    });

    it('returns object to specification', () => {
        const edgeAgent = {
            'properties.desired.a': 'a',
            'properties.desired.modules.module1': {
                restartPolicy: 'restartPolicy',
                settings: {
                    image: 'image'
                },
                status: 'status',
                type: 'type'
            },
            'properties.desired.modules.module2.image': 'image',
            'properties.desired.runtime.settings.registryCredentials': { reg1: { address: 'address', password: 'password', username: 'username' }}
        };

        const modulesContent = {
            module1: {
                'properties.desired.x': 'y'
            }
        };

        const result = get$EdgeAgentPatchEntries(edgeAgent, modulesContent);
        expect(Object.keys(result.additionalEdgeAgentEntries)).toHaveLength(2); // tslint:disable-line:no-magic-numbers
        expect(Object.keys(result.additionalEdgeAgentEntries)[0]).toEqual('properties.desired.a');
        expect(Object.keys(result.additionalEdgeAgentEntries)[1]).toEqual('properties.desired.modules.module2.image');

        expect(result.registryCredentials).toHaveLength(1);
        expect(result.registryCredentials[0].name).toEqual('reg1');

        expect(result.moduleSpecificationViewModels).toHaveLength(1);
        expect(result.moduleSpecificationViewModels[0].desiredProperties).toEqual({
            'properties.desired.x': 'y'
        });
    });
});

describe('filterRegistryCredentials', () => {
    it('returns false when pathArray.length < 5', () => {
        const payload = {
            $edgeEntries: {
                additionalEdgeAgentEntries: {},
                moduleSpecificationViewModels: [],
                registryCredentials: []
            },
            $edgeObject: null,
            key: 'props.something',
            pathArray: ['props', 'something']
        };

        expect(filterRegistryCredentials(payload)).toEqual(false);
    });

    it('returns false when pathArray does not have registryCredentials at designated depth', () => {
        const payload = {
            $edgeEntries: {
                additionalEdgeAgentEntries: {},
                moduleSpecificationViewModels: [],
                registryCredentials: []
            },
            $edgeObject: null,
            key: 'properties.desired.runtime.settings.noRegistryCredentials',
            pathArray: ['properties', 'desired', 'runtime', 'settings', 'notRegistryCredentials']
        };

        expect(filterRegistryCredentials(payload)).toEqual(false);
    });

    it('returns false when pathArray exceeds designated depth', () => {
        const payload = {
            $edgeEntries: {
                additionalEdgeAgentEntries: {},
                moduleSpecificationViewModels: [],
                registryCredentials: []
            },
            $edgeObject: null,
            key: 'properties.desired.runtime.settings.reg1.address',
            pathArray: ['properties', 'desired', 'runtime', 'settings', 'registryCredentials', 'reg1', 'address']
        };

        expect(filterRegistryCredentials(payload)).toEqual(false);
    });

    it('returns true and amends registry credentials when registryCredentials defined', () => {
        const payload = {
            $edgeEntries: {
                additionalEdgeAgentEntries: {},
                moduleSpecificationViewModels: [],
                registryCredentials: []
            },
            $edgeObject: {
                'properties.desired.runtime.settings.registryCredentials': {
                    reg1: {
                        address: 'address',
                        password: 'password',
                        username: 'username'
                    }
                }
            },
            key: 'properties.desired.runtime.settings.registryCredentials',
            pathArray: ['properties', 'desired', 'runtime', 'settings', 'registryCredentials']
        };

        expect(filterRegistryCredentials(payload)).toEqual(true);
        expect(payload.$edgeEntries.registryCredentials).toHaveLength(1);
        expect(payload.$edgeEntries.registryCredentials[0]).toEqual({
            address: 'address',
            name: 'reg1',
            password: 'password',
            username: 'username'
        });
    });

    it('returns true and amends registry credentials when registryCredential defined', () => {
        const payload = {
            $edgeEntries: {
                additionalEdgeAgentEntries: {},
                moduleSpecificationViewModels: [],
                registryCredentials: []
            },
            $edgeObject: {
                'properties.desired.runtime.settings.registryCredentials.reg1': {
                        address: 'address',
                        password: 'password',
                        username: 'username'
                }
            },
            key: 'properties.desired.runtime.settings.registryCredentials.reg1',
            pathArray: ['properties', 'desired', 'runtime', 'settings', 'registryCredentials', 'reg1']
        };

        expect(filterRegistryCredentials(payload)).toEqual(true);
        expect(payload.$edgeEntries.registryCredentials).toHaveLength(1);
        expect(payload.$edgeEntries.registryCredentials[0]).toEqual({
            address: 'address',
            name: 'reg1',
            password: 'password',
            username: 'username'
        });
    });
});

describe('filterModules', () => {
    it('returns false when pathArray.length < 3', () => {
        const payload = {
            $edgeEntries: {
                additionalEdgeAgentEntries: {},
                moduleSpecificationViewModels: [],
                registryCredentials: []
            },
            $edgeObject: null,
            key: 'props.something',
            pathArray: ['props', 'something']
        };

        expect(filterModules(payload)).toEqual(false);
    });

    it('returns false when pathArray does not contain modules at designated depth', () => {
        const payload = {
            $edgeEntries: {
                additionalEdgeAgentEntries: {},
                moduleSpecificationViewModels: [],
                registryCredentials: []
            },
            $edgeObject: null,
            key: 'properties.desired.notModules',
            pathArray: ['properties', 'desired', 'notModules']
        };

        expect(filterModules(payload)).toEqual(false);
    });

    it('returns false when pathArray exceeds module depth', () => {
        const payload = {
            $edgeEntries: {
                additionalEdgeAgentEntries: {},
                moduleSpecificationViewModels: [],
                registryCredentials: []
            },
            $edgeObject: null,
            key: 'properties.desired.modules.x.image',
            pathArray: ['properties', 'desired', 'modules', 'x', 'image']
        };

        expect(filterModules(payload)).toEqual(false);
    });

    it('returns true and amends modules when modules defined', () => {
        const payload = {
            $edgeEntries: {
                additionalEdgeAgentEntries: {},
                moduleSpecificationViewModels: [],
                registryCredentials: []
            },
            $edgeObject: {
                'properties.desired.modules': {
                    module1: {
                        restartPolicy: 'restartPolicy',
                        settings: {
                            image: 'image'
                        },
                        status: 'status',
                        type: 'type'
                    },
                    module2: {
                        restartPolicy: 'restartPolicy',
                        settings: {
                            image: 'image'
                        },
                        status: 'status',
                        type: 'type'
                    }
                }
            },
            key: 'properties.desired.modules',
            pathArray: ['properties', 'desired', 'modules']
        };

        expect(filterModules(payload)).toEqual(true);
        expect(payload.$edgeEntries.moduleSpecificationViewModels).toHaveLength(2); // tslint:disable-line:no-magic-numbers
        expect(payload.$edgeEntries.moduleSpecificationViewModels[0].name).toEqual('module1');
        expect(payload.$edgeEntries.moduleSpecificationViewModels[1].name).toEqual('module2');
    });

    it('returns true and amends module when module defined', () => {
        const payload = {
            $edgeEntries: {
                additionalEdgeAgentEntries: {},
                moduleSpecificationViewModels: [],
                registryCredentials: []
            },
            $edgeObject: {
                'properties.desired.modules.module1': {
                    restartPolicy: 'restartPolicy',
                    settings: {
                        image: 'image'
                    },
                    status: 'status',
                    type: 'type'
                }
            },
            key: 'properties.desired.modules.module1',
            pathArray: ['properties', 'desired', 'modules', 'module1']
        };

        expect(filterModules(payload)).toEqual(true);
        expect(payload.$edgeEntries.moduleSpecificationViewModels).toHaveLength(1); // tslint:disable-line:no-magic-numbers
        expect(payload.$edgeEntries.moduleSpecificationViewModels[0].name).toEqual('module1');
    });

});
