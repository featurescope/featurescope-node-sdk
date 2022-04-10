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
  headers?: { [key: string]: string }
}

const url = "https://www.featurescope.io"

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
  if (typeof options === "string") options = { apiKey: options, headers: {} }

  const apiKey = options?.apiKey ?? null
  const headers: { [key: string]: string } = {
    ...(options?.headers || {}),
    "Content-Type": "application/json",
  }

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`
  }

  const fetcher = (path: string, options: RequestInit = {}): Promise<any> =>
    fetch(`${url}${path}`, {
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

  const createFeatureVariations = () => {
    throw new FeaturesClientNotImplementedError("createFeatureVariations")
  }
  const createFeatureVariation = () => {
    throw new FeaturesClientNotImplementedError("createFeatureVariations")
  }
  const getAllVariationsForFeaturesList = () => {
    throw new FeaturesClientNotImplementedError("createFeatureVariations")
  }
  const getAllVariationsForFeature = () => {
    throw new FeaturesClientNotImplementedError("getAllVariationsForFeature")
  }

  const listFeaturesForScope = (scope: string): Promise<Array<string>> =>
    fetcher(`api/v1/features?scope=${scope}`)
  const listScopesForUser = (): Promise<Array<string>> =>
    fetcher("/api/v1/scopes")

  const findFeaturesListVariationsByDemographics = (
    scope: string = "_",
    featureIds?: Array<string>,
    demographics: Demographics = {},
  ): Promise<Features> => {
    const params = new URLSearchParams({ scope, ...demographics })

    if (Array.isArray(featureIds))
      params.set("featureIds", featureIds.join(","))
    return fetcher(`/api/v1/variations?${params}`)
  }

  const findFeatureVariationByDemographics = (
    scope: string = "_",
    featureId: string,
    demographics: Demographics = {},
  ): Promise<JsonValue> =>
    findFeaturesListVariationsByDemographics(
      scope,
      [featureId],
      demographics,
    ).then((variationsByFeatureId) => variationsByFeatureId[featureId])

  return {
    createFeatureVariation,
    createFeatureVariations,
    findFeatureVariationByDemographics,
    findFeaturesListVariationsByDemographics,
    getAllVariationsForFeature,
    getAllVariationsForFeaturesList,
    listFeaturesForScope,
    listScopesForUser,
  }
}
