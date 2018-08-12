type TCleaning = 'cleaning'
type TGardening = 'gardening'
type TIroning = 'ironing'

export interface IServiceCleaningPostBody {
  carpetClean: boolean
  deepClean: boolean
  general: boolean
  hasOwnEquipment: boolean
  hasOwnProducts: boolean
  hourlyRate: number
  ovenClean: boolean
}

export interface IServiceGardeningPostBody {
  general: boolean
  hasOwnEquipment: boolean
  hasOwnProducts: boolean
  hourlyRate: number
  specialist: boolean
}

export interface IServiceIroningPostBody {
  bedLinen: boolean
  collectAndReturn: boolean
  hasOwnEquipment: boolean
  hourlyRate: number
  other: boolean
  shirts: boolean
  specialist: boolean
  trousers: boolean
}

export interface IServiceGardeningDocument extends IServiceGardeningPostBody {
  service: TGardening
  userId: string
}

export type IServiceDocument =
  | IServiceCleaningDocument
  | IServiceGardeningDocument
  | IServiceIroningDocument

export interface IServiceCleaningDocument extends IServiceCleaningPostBody {
  service: TCleaning
  userId: string
}

export interface IServiceIroningDocument extends IServiceIroningPostBody {
  service: TIroning
  userId: string
}

export interface IUserPostBody {
  email: string
  firstName: string
  lastName: string
  postcode: string
}

export interface IUserDocument extends IUserPostBody {
  _id: string
}

export type TService = TCleaning | TGardening | TIroning
