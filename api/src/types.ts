import { ILocation } from 'shared/types'

export interface IServiceCreateParams {
  carpetClean: boolean
  deepClean: boolean
  description?: string
  general: boolean
  hasOwnEquipment: boolean
  hasOwnProducts: boolean
  hourlyRate: number
  location: ILocation
  name: string
  ovenClean: boolean
  radius: number
  userId: string
}

export interface IService extends IServiceCreateParams {
  id: string
  imagePath?: string
}
