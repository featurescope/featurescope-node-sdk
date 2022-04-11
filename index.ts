import fetch from "cross-fetch"

export type Demographics = Record<string, number | string>

export type JsonValue =
  | number
  | string
  | null
  | Array<JsonValue>
  | { [key: string]: JsonValue }

export type Features = Record<string, JsonValue>

export interface FeaturesClientOptions {
  apiKey: string | null
  apiUrl?: string
  headers?: { [key: string]: string }
  scope?: string
}

const DEFAULT_API_URL = "https://www.featurescope.io"
const DEFAULT_SCOPE = "_"

export class FeaturesClientInitError extends Error {
  constructor(message: string) {
    super(`Could not instantiate features client: ${message}`)
  }
}

export class FeaturesClientNotImplementedError extends Error {
  constructor(method: string) {
    super(`Method "${method}" not implemented`)
  }
}

export function init(options: FeaturesClientOptions | string | null) {
  if (typeof options === "string") {
    options = {
      apiKey: options,
      apiUrl: DEFAULT_API_URL,
      headers: {},
      scope: DEFAULT_SCOPE,
    }
  }

  const apiKey = options?.apiKey ?? null
  const apiUrl = options?.apiUrl ?? DEFAULT_API_URL
  const headers: { [key: string]: string } = {
    ...(options?.headers || {}),
    "Content-Type": "application/json",
  }
  const scope = options?.scope ?? DEFAULT_SCOPE

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`
  }

  const fetcher = (path: string, options: RequestInit = {}): Promise<any> =>
    fetch(`${apiUrl}${path}`, {
      ...options,
      headers,
      method: options.method || "get",
    })
      .then((response) => {
        if (response.ok) return response.json()
        return Promise.reject({ errors: ["Unknown error"] })
      })
      .then(({ data, errors }) => {
        if (Array.isArray(errors) && errors.length) {
          return Promise.reject(errors[0])
        }

        return data
      })

  const createFeatureVariation = () => {
    throw new FeaturesClientNotImplementedError("createFeatureVariations")
  }
  const createFeatureVariations = () => {
    throw new FeaturesClientNotImplementedError("createFeatureVariations")
  }
  const getAllVariationsForFeature = () => {
    throw new FeaturesClientNotImplementedError("getAllVariationsForFeature")
  }
  const getAllVariationsForFeaturesList = () => {
    throw new FeaturesClientNotImplementedError("createFeatureVariations")
  }

  const listScopesForUser = (): Promise<Array<string>> =>
    fetcher("/api/v1/scopes")

  const listFeaturesForScope = (scope: string): Promise<Array<string>> =>
    fetcher(`/api/v1/features?scope=${scope}`)

  const findFeaturesListVariationsByDemographics = (
    demographics: Demographics = {},
    options?: { featureIds?: Array<string> },
  ): Promise<Features> => {
    const params = new URLSearchParams({ scope, ...demographics })

    if (options && Array.isArray(options.featureIds)) {
      params.set("featureIds", options.featureIds.join(","))
    }

    return fetcher(`/api/v1/variations?${params}`)
  }

  const findFeatureVariationByDemographics = (
    featureId: string,
    demographics: Demographics = {},
  ): Promise<JsonValue> =>
    findFeaturesListVariationsByDemographics(demographics, {
      featureIds: [featureId],
    }).then((variationsByFeatureId) => variationsByFeatureId[featureId])

  return {
    createFeatureVariation,
    createFeatureVariations,
    findFeatureVariationByDemographics,
    findFeaturesListVariationsByDemographics,
    getAllVariationsForFeature,
    getAllVariationsForFeaturesList,
    getFeature: findFeatureVariationByDemographics,
    getFeatures: findFeaturesListVariationsByDemographics,
    listFeaturesForScope,
    listScopesForUser,
  }
}
