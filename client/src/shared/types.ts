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

export interface IServiceCleaningModelParams extends IServiceCleaningPostBody {
  service: TCleaning
  userId: string
}

export interface IServiceGardeningModelParams
  extends IServiceGardeningPostBody {
  service: TGardening
  userId: string
}

export interface IServiceIroningModelParams extends IServiceIroningPostBody {
  service: TIroning
  userId: string
}

export interface IServiceCleaningDocument extends IServiceCleaningModelParams {
  _id: string
}

export interface IServiceGardeningDocument
  extends IServiceGardeningModelParams {
  _id: string
}

export interface IServiceIroningDocument extends IServiceIroningModelParams {
  _id: string
}

export type IServiceDocument =
  | IServiceCleaningDocument
  | IServiceGardeningDocument
  | IServiceIroningDocument

export interface IUserPostBody {
  email: string
  firstName: string
  lastName: string
  postcode: string
  radius: number
}

export interface IUserDocument extends IUserPostBody {
  _id: string
}

export type TService = TCleaning | TGardening | TIroning
