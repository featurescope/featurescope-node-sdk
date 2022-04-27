# @featurescope/node-sdk

Node.js SDK for [featurescope](https://www.featurescope.io).

Featurescope provides simple, reliable, and remotely configurable feature management to power your applications.

## Installation

```sh
npm install @featurescope/node-sdk

# or ...

yarn add @featurescope/node-sdk
```

## Setup

In order to use the featurescope Node.js SDK, you'll also have to create a featurescope account.

Visit [featurescope.io](https://www.featurescope.io "featurescope.io") and register for a new account.

Next, follow the instructions on the [Getting started](https://www.featurescope.io/getting-started "Getting started") page. These steps will walk you through creating your first feature and fetching it with a featurescope SDK.

## Usage

The featurescope Node.js SDK is an unopinionated JavaScript client - It exposes a number of functional wrappers around the RESTful featuresope API, the most useful of which are the methods used to fetch a feature or a set of features. Use this SDK in your web bundles, or on the server side.

If you are creating a React application, it is recommended that you use the [@featurescope/react-sdk](https://github.com/featurescope/featurescope-react-sdk "@featurescope/react-sdk").

To integrate with the Node.js SDK, initialize a featurescope client in your application, with a scope defined, and fetch all of features associated with the scope:

```js
import Featurescope from "@featurescope/node-sdk"
import express from "express"

const scope = process.env.NODE_ENV
const client = Featurescope.init({ apiKey, scope })

init()

async function init() {
  const app = express()
  const { port, useJson } = await client.getFeatures()

  if (useJson) app.use(express.json())

  app.listen(port, () => console.info(`started express on port ${port}`))
}
```

All of the configuration options available to the client are described below. You may use these props to control which feature variations are provided by the `FeaturesContext`.

Alternatively, a specific list of features can be resolved:

```js
const { port, useJson } = await client.getFeatures(attributes, {
  featureIds: ["port", "useJson"],
})
```

It is recommended that you be specific about which features to load as often as possible. There's no limit to how many features can exist within a single scope.

## API Methods

In addition to the `getFeatures` and `getFeature` method, the Node.js client exposes a number of other helpful methods for working with the featurescope API.

### `createFeatureVariation`

Not implemented.

### `createFeatureVariations`

Not implemented.

### `findFeatureVariationByAttributes`

Fetch a feature variation for a collection of attributes. Aliased by `getFeature`.

Returns a feature variation:

```js
const attributes = { city: "New York", state: "NY" }
const variation = client.findFeatureVariationByAttributes(
  "featureId",
  attributes,
)

console.log(variation) // "JsonValue"
```

### `findFeaturesListVariationsByAttributes`

Fetch a list of feature variations for a collection of attributes. Aliased by `getFeatures`.

Returns a collection of feature variations by feature id:

```js
const attributes = { city: "New York", state: "NY" }
const options = { featureIds: ["featureId"] } // optional
const variationsByFeatureId = client.getFeatures(attributes, options)

console.log(variationsByFeatureId) // { featureId: "JsonValue" }
```

### `getAllVariationsForFeature`

Not implemented.

### `getAllVariationsForFeaturesList`

Not implemented.

### `getFeature`

Fetch a feature variation for a collection of attributes. Alias of `findFeatureVariationByAttributes`.

Returns a feature variation:

```js
const attributes = { city: "New York", state: "NY" }
const variation = client.getFeature("featureId", attributes)

console.log(variation) // "JsonValue"
```

### `getFeatures`

Fetch a list of feature variations for a collection of attributes. Alias of `findFeaturesListVariationsByAttributes`.

Returns a collection of feature variations by feature id:

```js
const attributes = { city: "New York", state: "NY" }
const options = { featureIds: ["featureId"] } // optional
const variationsByFeatureId = client.getFeatures(attributes, options)

console.log(variationsByFeatureId) // { featureId: "JsonValue" }
```

### `listFeaturesForScope`

Returns a list of features for the given scope:

```js
const featureIds = client.listFeaturesForScope("default")

console.log(featureIds) // ["featureId"]
```

### `listScopesForUser`

Returns a list of scopes for the current user:

```js
const scopes = client.listScopesForUser()

console.log(scopes) // ["default", "development", "staging", "production"]
```

## Configuration Options

This table includes all of the options available to the client:

| name            | description                                                                                                                                          | type           | default                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ----------------------------- |
| apiKey          | The key to use to connect to the featurescope API.                                                                                                   | string \| null | null                          |
| apiUrl          | The URL of the featurescope API. Mainly used for testing purposes.                                                                                   | string         | "https://www.featurescope.io" |
| attributes      | Attributes inform the API which feature variations should be served.                                                                                 | Attributes     | {}                            |
| children        | React children                                                                                                                                       | React.node     | undefined                     |
| defaultFeatures | Default values to provide for any potential features. If the API does not return a matching feature by name, then these values will not be replaced. | Features       | {}                            |
| featureIds      | A list of features to which the providers should be limited.                                                                                         | Array<string>  |                               |
| scope           | The scope of features which should be loaded by the SDK.                                                                                             | string         | "\_"                          |
