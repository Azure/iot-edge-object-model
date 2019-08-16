import { EdgeModuleSpecificationViewModel } from './edgeModuleSpecificationViewModel';
import { StringMap } from '../utilities/stringMap';
import { RegistryCredentialViewModel } from './registryCredentialViewModel';

export interface $EdgeAgentPatchEntries {
    moduleSpecificationViewModels: EdgeModuleSpecificationViewModel[];
    registryCredentials: RegistryCredentialViewModel[];
    additionalEdgeAgentEntries: StringMap<string | object>;
}

export interface $EdgeHubPatchEntries {
    routePaths: StringMap<string | object>;
    additionalEdgeHubEntries: StringMap<string | object>;
}

export type EdgeConfigurationContentPatchViewModel = $EdgeAgentPatchEntries & $EdgeHubPatchEntries;
