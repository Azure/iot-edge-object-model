[![Build Status](https://travis-ci.org/Azure/iot-edge-object-model.svg?branch=master)](https://travis-ci.org/Azure/iot-edge-object-model)

# Overview
The IoT Edge Object Model is an isomorphic JavaScript library aiding the creation and update of IoT Edge [deployment manifests](https://docs.microsoft.com/en-us/azure/iot-edge/module-composition).  It provides an object model supporting the following scenarios:

1. Instantiate a new deployment manifest with default EdgeAgent and EdgeHub values (e.g. create options, restart policy, et. al.).
2. Clone an At-Scale deployment.
3. Extract a deployment manifest from $EdgeAgent and $EdgeHub module twin desired properties.
4. Extract IoT Edge module status (e.g. last updated time, exit code) from $EdgeAgent and $EdgeHub module twin reported properties.

The object model supplies a common API to view and edit deployment manifests regardless of whether they originate from an [At-Scale](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-deploy-monitor) or [single device](https://docs.microsoft.com/en-us/azure/iot-edge/module-deployment-monitoring) deployment.

# Installation
The library is available via npmjs.org
```js
npm install iot-edge-object-model --save-exact
```

# How To Use
The following sections specify how to consume library capabilities.

## Create a new deployment manifest
A new IoT Edge deployment manifest can be instantiated with default parameters using the following code snippet:

```js
import { newEdgeConfigurationContentViewModel, generateConfigurationContent } from 'iot-edge-object-model';
...
const configurationViewModel = newEdgeConfigurationContentViewModel();
```

The [configurationContentViewModel](./src/viewModel/edgeConfigurationContentViewModel.ts) contains all properties to specify a deployment manifest.  For example, $EdgeAgent and $EdgeHub properties can be updated:

```js
const configurationViewModel = newEdgeConfigurationContentViewModel();

// add a registry credential.
configurationViewModel.$edgeAgentDesiredPropertiesViewModel.registryCredentials.push({
    name: 'registryCredential',
    address: 'endpoint',
    username: 'username value',
    password: 'password value'
});

// change store and forward time to live
configurationViewModel.$edgeHubDesiredPropertiesViewModel.storeAndForwardTimeToLive = 7200;
```

Custom modules can also be amended:
```js
configurationViewModel.$edgeAgentDesiredPropertiesViewModel.moduleSpecificationViewModels.push({
    name: 'modulename'
    type: 'docker'
    createOptions: ''
    image: 'imageurl'
    version: '1.0'
    environmentVariables: [{
        name: 'variableName',
        value: 'variableValue'
    }],
    desiredProperties: {
        "properties.desired": {
            "desiredProperty":"propertyValue"
        }
    }
    restartPolicy: 'always'
    status: 'running'
});
```
Notably, the 'configurationViewModel' object is not a deployment manifest; it is a view model streamlining common editing tasks.  For example, the deployment manifest stores custom modules, registry credentials, and environment variables in a dictionary format.  The view model formats these data structures into arrays to simplify editing.  Once ready, the view model can be output to a deployment manifest:

```js
const modulesContent = generateConfigurationContent(configurationContentViewModel);
```

The output object corresponds to the modulesContent object of a deployment.  It can be inserted as part of an At-Scale deployment or posted to configure an individual device.

## Clone an At-Scale Deployment
At Scale deployments are immutable but must occassionally be cloned with updates.  Once the source deployment has been retrieved from the [IoT Hub API](https://docs.microsoft.com/en-us/rest/api/iothub/service/getconfigurations), modulesContent can be edited:

```js
import { toEdgeConfigurationContentViewModel, generateConfigurationContent } from 'iot-edge-object-model';
...
let deployment;
// get deployment from API.

const configurationViewModel = toEdgeConfigurationContentViewModel(deployment.modulesContent);
// perform edits.

const modulesContent = generateConfigurationContentViewModel(configurationViewModel);
// submit new deployment with updated modules content.
```

If the source deployment is malformed or does not adhere to schema, a exception is thrown of type: [EdgeParseException](./src/errors/edgeParseException.ts).

## Extract a deployment manifest from $EdgeAgent and $EdgeHub module twins
A deployment manifest must sometimes be extracted from the desired properties of the device's $EdgeAgent and $EdgeHub module twins.  The library supports this scenario:

```js
import {
    to$EdgeAgentModuleTwinViewModel,
    to$EdgeHubModuleTwinViewModel,
    convertToEdgeConfigurationContentViewModel,
    generateConfigurationContent } from 'iot-edge-object-model';

let edgeAgentTwin;
 // get $EdgeAgent module twin from API.

let edgeHubTwin;
// get $EdgeHub module twin from API.

const edgeModuleTwinsViewModel = {
    $edgeAgent: to$EdgeAgentModuleTwinViewModel(edgeAgentTwin),
    $edgeHub: to$EdgeHubModuleTwinViewModel(edgeHubTwin)
};
```

If either the desired properties of $EdgeAgent or $EdgeHub are malfomed or do not adhere to schema, an exception is thrown of type: [EdgeParseException](./src/errors/edgeParseException.ts).

The [edgeModuleTwinsViewModel](./src/viewModel/$EdgeModuleTwinsViewModel.ts) encapsulates both the desired and reported properties of the $EdgeAgent/$EdgeHub twins.  To prepare a new deployment manifest, only the desired properties are necessary.  The library provides a helper function to format this information into a EdgeConfigurationContentViewModel:

```js
const configurationContentViewModel = convertToEdgeConfigurationContentViewModel(edgeModuleTwinsViewModel);
// perform edits.
const modulesContent = generateConfigurationContent(configurationContentViewModel);
// submit updated deployment manifest.
```

The desired properties of either the $EdgeAgent or $EdgeHub module twin may not be present in all scenarios.  If unavailable (e.g. null on [EdgeModuleTwinsViewModel](./src/viewModel/$EdgeModuleTwinsViewModel.ts)), default properties (as defined when calling newEdgeConfigurationContent) are substituted.

## Extract IoT Edge Module Status
The reported and desired properties from $EdgeAgent/$EdgeHub module twins can be used to examine the state of a deployment on a device.

```js
import {
    to$EdgeAgentModuleTwinViewModel,
    to$EdgeHubModuleTwinViewModel,
    convertToconvertToEdgeModuleViewModels } from 'iot-edge-object-model';

let edgeAgentTwin;
// get $EdgeAgent module twin from API.

let edgeHubTwin;
// get $EdgeHub module twin from API.

const edgeModuleTwinsViewModel = {
    $edgeAgent: to$EdgeAgentModuleTwinViewModel(edgeAgentTwin),
    $edgeHub: to$EdgeHubModuleTwinViewModel(edgeHubTwin)
};

const edgeModuleViewModels = convertToEdgeModuleViewModels(edgeModuleTwinsViewModel);
```

The resulting array of [EdgeModuleViewModel](./src/viewModel/edgeModuleViewModel.ts)s includes a digest of both system (e.g. EdgeAgent, EdgeHub) and custom IoT Edge modules.  These digests indicate whether the IoT Edge modules is desired, reported, or both.  It subsequently allows comparison between desired and reported state.

## Generate and Parse Add-On Deployment Manifests
Add-On Deployments are a feature of Microsoft Azure IoT Hubs enabling a partial deployment manifest to be submitted.  The add-on deployment manifest is subsequently matched with the highest priority full deployment for a target device.  The device receives an amended deployment manifest merging the add-on settings into the full deployment.  To generate an add-on deployment manifest, first generate an [EdgeConfigurationContentViewModel](./src/viewModel/edgeConfigurationContentPatchViewModel.ts) and use the result from [generateConfigurationContentPatch](./src/generators/edgeConfigurationContentPatchGenerator.ts).  An add-on deployment manifest can be parsed into an EdgeConfigurationContentViewModel using the [toEdgeConfigurationContentPatchViewModel](./src/parsers/edgeConfigurationContentPatchParser.ts) function.  The parser extracts module, registry credential, and route information.  Additional settings associated with the $EdgeAgent or $EdgeHub twins are placed respectively in the additionalEdgeAgentEntries and addtionalEdgeHubEntries members.  These additional settings are amended to the add-on deployment manifest when executing generateConfigurationContentPatch method, provided they do not conflict with provided module, registry credential, and route information.

# Conventions
The adoption of view models simplifies several editing tasks.  It additionally insulates consuming applications from changes to the IoT Edge deployment schema.  As additional schema versions are introduced, applications may continue to support deployments issued in prior schemas.  Currently, the library supports the following schema versions:

* EdgeAgent: 1.0
* EdgeHub: 1.0

If either the EdgeAgent or EdgeHub schemaVersion properties specify an unsupported version, the library throws an instance of [EdgeUnsupportedSchemaException](./src/errors/edgeUnsupportedSchemaException.ts).

Reviewing source file, readers will encounter the use of $ in file and type names.  This convention arises because 'EdgeAgent' and 'EdgeHub' may refer either to a module identity twin or IoT Edge modules deployed to a device. As a coding convention, types are prefixed with '$' (e.g. $EdgeAgent and $EdgeHub) when they refer to module identity twin data structures. Conversely, the ommission of '$' indicates the type models a portion of the deployment manifest.

## Linting
The library utilizes [TSLint](https://www.npmjs.com/package/tslint) to maintain consistent code format.  Linting rules are viewable [here](./tslint.json).

## Tests
The library utilizes [Jest](https://jestjs.io/) for unit tests and code coverage calculation.  Unit tests reside adjacent to production files and are demarcated with a .spec.ts[x] extension.

## Contributing
The IoT UPX team welcomes suggestions, bug reports, and contributions.  Our contributing guidelines are available [here](./CONTRIBUTING.md).  Notably, the team intends to keep this library focused on easing the challenges of displaying and editing deployment manifests.