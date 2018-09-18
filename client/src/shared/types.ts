import * as t from 'io-ts'

type TCleaning = 'cleaning'
type TGardening = 'gardening'
type TIroning = 'ironing'

const isDecimal = (m: any): m is number =>
  typeof m === 'number' && String(m).length <= m.toFixed(2).length

const decimal = new t.Type<number, number>(
  'decimal',
  isDecimal,
  (m: any, c) => (isDecimal(m) ? t.success(m) : t.failure(m, c)),
  t.identity,
)

const cleaningPostBodyObj = {
  carpetClean: t.boolean,
  deepClean: t.boolean,
  general: t.boolean,
  hasOwnEquipment: t.boolean,
  hasOwnProducts: t.boolean,
  hourlyRate: decimal,
  ovenClean: t.boolean,
}

const gardeningPostBodyObj = {
  general: t.boolean,
  hasOwnEquipment: t.boolean,
  hasOwnProducts: t.boolean,
  hourlyRate: decimal,
  specialist: t.boolean,
}

const ironingPostBodyObj = {
  bedLinen: t.boolean,
  collectAndReturn: t.boolean,
  hasOwnEquipment: t.boolean,
  hourlyRate: t.number,
  other: t.boolean,
  shirts: t.boolean,
  specialist: t.boolean,
  trousers: t.boolean,
}

export const CleaningPostBody = t.exact(t.type(cleaningPostBodyObj))
export const GardeningPostBody = t.exact(t.type(gardeningPostBodyObj))
export const IroningPostBody = t.exact(t.type(ironingPostBodyObj))

export type ICleaningPostBody = t.TypeOf<typeof CleaningPostBody>
export type IGardeningPostBody = t.TypeOf<typeof GardeningPostBody>
export type IIroningPostBody = t.TypeOf<typeof IroningPostBody>

export const CleaningDocument = t.exact(
  t.type({
    ...cleaningPostBodyObj,
    _id: t.string,
    userId: t.string,
  }),
)

export const GardeningDocument = t.exact(
  t.type({
    ...gardeningPostBodyObj,
    _id: t.string,
    userId: t.string,
  }),
)

export const IroningDocument = t.exact(
  t.type({
    ...ironingPostBodyObj,
    _id: t.string,
    userId: t.string,
  }),
)

const cleaningFiltersObj = {
  carpetClean: t.boolean,
  deepClean: t.boolean,
  general: t.boolean,
  hasOwnEquipment: t.boolean,
  hasOwnProducts: t.boolean,
  hourlyRate: decimal,
  ovenClean: t.boolean,
}

const gardeningFiltersObj = {
  general: t.boolean,
  hasOwnEquipment: t.boolean,
  hasOwnProducts: t.boolean,
  hourlyRate: decimal,
  specialist: t.boolean,
}

const ironingFiltersObj = {
  bedLinen: t.boolean,
  collectAndReturn: t.boolean,
  hasOwnEquipment: t.boolean,
  other: t.boolean,
  shirts: t.boolean,
  specialist: t.boolean,
  trousers: t.boolean,
}

export const CleaningFilters = t.partial(cleaningFiltersObj)
export const GardeningFilters = t.partial(gardeningFiltersObj)
export const IroningFilters = t.partial(ironingFiltersObj)

export type ICleaningFilters = t.TypeOf<typeof CleaningFilters>
export type IGardeningFilters = t.TypeOf<typeof GardeningFilters>
export type IIroningFilters = t.TypeOf<typeof IroningFilters>

export const CleaningSearchParams = t.exact(
  t.intersection([
    CleaningFilters,
    t.type({
      limit: t.number,
      skip: t.number,
    }),
  ]),
)

export const GardeningSearchParams = t.exact(
  t.intersection([
    GardeningFilters,
    t.type({
      limit: t.number,
      skip: t.number,
    }),
  ]),
)

export const IroningSearchParams = t.exact(
  t.intersection([
    IroningFilters,
    t.type({
      limit: t.number,
      skip: t.number,
    }),
  ]),
)

export type ICleaningSearchParams = t.TypeOf<typeof CleaningSearchParams>
export type IGardeningSearchParams = t.TypeOf<typeof GardeningSearchParams>
export type IIroningSearchParams = t.TypeOf<typeof IroningSearchParams>

export interface IServiceCleaningModelParams extends ICleaningPostBody {
  userId: string
}

export interface IServiceGardeningModelParams extends IGardeningPostBody {
  userId: string
}

export interface IServiceIroningModelParams extends IIroningPostBody {
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
