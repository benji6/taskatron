import axios from 'axios'
import * as config from 'config'
import pino from '../pino'
import { ICoord } from '../shared/types'

// more info here https://msdn.microsoft.com/en-us/library/ff701714.aspx
export default (postcode: string): Promise<ICoord> => {
  const url = `https://dev.virtualearth.net/REST/v1/Locations/UK/${postcode}?maxResults=1&key=${config.get(
    'bingMapsApiKey',
  )}`

  return axios.get(url).then(
    ({ data }): ICoord => {
      const coordinates =
        data &&
        data.resourceSets &&
        data.resourceSets[0] &&
        data.resourceSets[0].resources &&
        data.resourceSets[0].resources[0] &&
        data.resourceSets[0].resources[0].point &&
        data.resourceSets[0].resources[0].point.coordinates

      if (Array.isArray(coordinates)) {
        const [latitude, longitude] = coordinates
        return { latitude, longitude }
      }

      pino.error(`geocode data in unexpected format for url: ${url}`, data)
      throw new Error('geocode data in unexpected format')
    },
  )
}
