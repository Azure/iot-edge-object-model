// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { generate$EdgeAgentConfigurationContentPatch, conflictWithModuleEntry, conflictWithRegistryCredentialEntry } from './$EdgeAgentConfigurationContentPatchGenerator';
import { newEdgeModuleSpecificationViewModel } from '../../../utilities/testHelpers';

describe('generate$EdgeAgentConfigurationContentPatch', () => {
    it('returns object to specification', () => {
        const edgeModuleSpecificationViewModel = newEdgeModuleSpecificationViewModel();
        edgeModuleSpecificationViewModel.name = 'module1';

        const patchEntries = {
            additionalEdgeAgentEntries: {
                'properties.desired.modules.module1.image': 'image',
                'properties.desired.runtime.settings.notRegistryCredentials': 'notRegistryCredentials',
                'properties.desired.runtime.settings.registryCredentials.reg1.username': 'reg1Username'
            },
            moduleSpecificationViewModels: [ edgeModuleSpecificationViewModel ],
            registryCredentials: [
                { address: 'address', name: 'name', username: 'username', password: 'password'}
            ],
        };

        const result = generate$EdgeAgentConfigurationContentPatch(patchEntries);
        expect(Object.keys(result)).toHaveLength(4); // tslint:disable-line:no-magic-numbers
        expect(result['properties.desired.modules.module1.image']).toBeUndefined();
        expect(result['properties.desired.runtime.settings.notRegistryCredentials']).toEqual('notRegistryCredentials');
        expect(result['properties.desired.runtime.settings.registryCredentials.reg1.username']).toEqual('reg1Username');
        expect(result['properties.desired.modules.module1']).not.toBeFalsy();
        expect(result['properties.desired.runtime.settings.registryCredentials.name']).toEqual({
            address: 'address',
            password: 'password',
            username: 'username',
        });
    });
});

describe('conflictWithModule', () => {
    it('returns false if set is empty', () => {
        expect(conflictWithModuleEntry('', new Set<string>())).toEqual(false);
    });

    it('returns true if properties.desired', () => {
        const moduleNames = new Set(['name']);
        const additionalEntry = 'properties.desired';
        expect(conflictWithModuleEntry(additionalEntry, moduleNames)).toEqual(true);
    });

    it('returns false if not under modules path', () => {
        const moduleNames = new Set(['name']);
        const additionalEntry = 'properties.desired.notmodules';
        expect(conflictWithModuleEntry(additionalEntry, moduleNames)).toEqual(false);
    });

    it('returns false if not under modules path set', () => {
        const moduleNames = new Set(['name']);
        const additionalEntry = 'properties.desired.modules.y';
        expect(conflictWithModuleEntry(additionalEntry, moduleNames)).toEqual(false);
    });

    it('returns false if not under modules path set', () => {
        const moduleNames = new Set(['name']);
        const additionalEntry = 'properties.desired.modules.y.image';
        expect(conflictWithModuleEntry(additionalEntry, moduleNames)).toEqual(false);
    });

    it('returns true if under modules path set', () => {
        const moduleNames = new Set(['name']);
        const additionalEntry = 'properties.desired.modules.name.image';
        expect(conflictWithModuleEntry(additionalEntry, moduleNames)).toEqual(true);
    });
});

describe('conflictWithRegistryCredentialEntry', () => {
    it('returns false if set is empty', () => {
        expect(conflictWithRegistryCredentialEntry({}, new Set<string>())).toEqual(false);
    });

    it('returns true if entry sets runtime object', () => {
        const registryCredentialNames = new Set(['name']);
        const additionalEntry = 'properties.desired.runtime';
        expect(conflictWithRegistryCredentialEntry(additionalEntry, registryCredentialNames)).toEqual(true);
    });

    it('returns true if properties.desired', () => {
        const registryCredentialNames = new Set(['name']);
        const additionalEntry = 'properties.desired';
        expect(conflictWithRegistryCredentialEntry(additionalEntry, registryCredentialNames)).toEqual(true);
    });

    it('returns true if entry sets setting object', () => {
        const registryCredentialNames = new Set(['name']);
        const additionalEntry = 'properties.desired.runtime.settings';
        expect(conflictWithRegistryCredentialEntry(additionalEntry, registryCredentialNames)).toEqual(true);
    });

    it('returns true if element of populated registry credential set', () => {
        const registryCredentialNames = new Set(['name']);
        const additionalEntry = 'properties.desired.runtime.settings.registryCredentials.name.address';
        expect(conflictWithRegistryCredentialEntry(additionalEntry, registryCredentialNames)).toEqual(true);
    });

    it('returns false if element is registryCredential', () => {
        const registryCredentialNames = new Set(['name']);
        const additionalEntry = 'properties.desired.runtime.settings.registryCredentials';
        expect(conflictWithRegistryCredentialEntry(additionalEntry, registryCredentialNames)).toEqual(false);
    });

    it('returns false if element is registryCredential.name', () => {
        const registryCredentialNames = new Set(['name']);
        const additionalEntry = 'properties.desired.runtime.settings.registryCredentials.name';
        expect(conflictWithRegistryCredentialEntry(additionalEntry, registryCredentialNames)).toEqual(false);
    });

    it('returns false if element branches at settings', () => {
        const registryCredentialNames = new Set(['name']);
        const additionalEntry = 'properties.desired.runtime.settings.notRegistryCredentials';
        expect(conflictWithRegistryCredentialEntry(additionalEntry, registryCredentialNames)).toEqual(false);
    });
});
