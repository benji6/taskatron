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
  userId: string
}

export interface IServiceGardeningModelParams
  extends IServiceGardeningPostBody {
  userId: string
}

export interface IServiceIroningModelParams extends IServiceIroningPostBody {
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

interface IServiceCleaningDocumentWithServiceType
  extends IServiceCleaningDocument {
  serviceType: TService
}

interface IServiceGardeningDocumentWithServiceType
  extends IServiceGardeningDocument {
  serviceType: TService
}

interface IServiceIroningDocumentWithServiceType
  extends IServiceIroningDocument {
  serviceType: TService
}

export type IServiceDocument =
  | IServiceCleaningDocumentWithServiceType
  | IServiceGardeningDocumentWithServiceType
  | IServiceIroningDocumentWithServiceType

export interface IServiceCleaningResponseObject
  extends IServiceCleaningDocument {
  providerName: string
}

export interface IServiceGardeningResponseObject
  extends IServiceGardeningDocument {
  providerName: string
}

export interface IServiceIroningResponseObject extends IServiceIroningDocument {
  providerName: string
}

export interface ICleaningServiceSearchResponse {
  results: IServiceCleaningResponseObject[]
  total: number
}

export interface IGardeningServiceSearchResponse {
  results: IServiceGardeningResponseObject[]
  total: number
}

export interface IIroningServiceSearchResponse {
  results: IServiceIroningResponseObject[]
  total: number
}

export interface IUserPatchBody {
  firstName: string
  lastName: string
  postcode: string
  radius: number
}

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
