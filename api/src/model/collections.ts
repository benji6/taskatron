import { CLEANING, GARDENING, IRONING } from '../shared/services'
import { TService } from '../shared/types'

export const CLEANING_SERVICES = 'cleaningServices'
export const GARDENING_SERVICES = 'gardeningServices'
export const IRONING_SERVICES = 'ironingServices'
export const USERS = 'users'

type TServiceCollectionName =
  | 'cleaningServices'
  | 'gardeningServices'
  | 'ironingServices'

export const serviceCollectionNames: TServiceCollectionName[] = [
  CLEANING_SERVICES,
  GARDENING_SERVICES,
  IRONING_SERVICES,
]

export const collectionNameToServiceType: {
  [key in TServiceCollectionName]: TService
} = {
  [CLEANING_SERVICES]: CLEANING,
  [GARDENING_SERVICES]: GARDENING,
  [IRONING_SERVICES]: IRONING,
}
