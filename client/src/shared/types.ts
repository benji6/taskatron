import * as t from 'io-ts'
import { radii } from './constants'

const postCodeRegex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})/

type TCleaning = 'cleaning'
type TGardening = 'gardening'
type TIroning = 'ironing'

const isDecimal = (a: any): a is number =>
  typeof a === 'number' && String(a).length <= a.toFixed(2).length
export const isEmail = (a: any): a is string =>
  typeof a === 'string' && /.+@.+/.test(a)
export const isFirstName = (a: any): a is string =>
  typeof a === 'string' && Boolean(a.length)
export const isLastName = (a: any): a is string =>
  typeof a === 'string' && Boolean(a.length)
export const isLatitude = (a: any): a is number =>
  typeof a === 'number' && a >= -90 && a <= 90
export const isLongitude = (a: any): a is number =>
  typeof a === 'number' && a >= -180 && a <= 180
export const isPostcode = (a: any): a is string =>
  typeof a === 'string' && postCodeRegex.test(a)
export const isRadius = (a: any): a is number =>
  typeof a === 'number' && radii.includes(a)

const decimal = new t.Type<number, number>(
  'decimal',
  isDecimal,
  (m: any, c) => (isDecimal(m) ? t.success(m) : t.failure(m, c)),
  t.identity,
)

const email = new t.Type<string, string>(
  'email',
  isEmail,
  (m: any, c) => (isEmail(m) ? t.success(m) : t.failure(m, c)),
  t.identity,
)

const firstName = new t.Type<string, string>(
  'firstName',
  isFirstName,
  (m: any, c) => (isFirstName(m) ? t.success(m) : t.failure(m, c)),
  t.identity,
)

const lastName = new t.Type<string, string>(
  'lastName',
  isLastName,
  (m: any, c) => (isLastName(m) ? t.success(m) : t.failure(m, c)),
  t.identity,
)

const latitude = new t.Type<number, number>(
  'latitude',
  isLatitude,
  (m: any, c) => (isLatitude(m) ? t.success(m) : t.failure(m, c)),
  t.identity,
)

const longitude = new t.Type<number, number>(
  'longitude',
  isLongitude,
  (m: any, c) => (isLongitude(m) ? t.success(m) : t.failure(m, c)),
  t.identity,
)

const postcode = new t.Type<string, string>(
  'postcode',
  isPostcode,
  (m: any, c) => (isPostcode(m) ? t.success(m) : t.failure(m, c)),
  t.identity,
)

const radius = new t.Type<number, number>(
  'radius',
  isRadius,
  (m: any, c) => (isRadius(m) ? t.success(m) : t.failure(m, c)),
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

export const CleaningFilters = t.partial({
  carpetClean: t.boolean,
  deepClean: t.boolean,
  general: t.boolean,
  hasOwnEquipment: t.boolean,
  hasOwnProducts: t.boolean,
  hourlyRate: decimal,
  latitude,
  longitude,
  ovenClean: t.boolean,
})
export const GardeningFilters = t.partial({
  general: t.boolean,
  hasOwnEquipment: t.boolean,
  hasOwnProducts: t.boolean,
  hourlyRate: decimal,
  specialist: t.boolean,
})
export const IroningFilters = t.partial({
  bedLinen: t.boolean,
  collectAndReturn: t.boolean,
  hasOwnEquipment: t.boolean,
  other: t.boolean,
  shirts: t.boolean,
  specialist: t.boolean,
  trousers: t.boolean,
})

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

export const UserPostBody = t.exact(
  t.type({
    email,
    firstName,
    lastName,
    postcode,
    radius,
  }),
)

export type IUserPostBody = t.TypeOf<typeof UserPostBody>

export interface IUserModelParams extends IUserPostBody {
  coords: ICoord
}

export interface IUserDocument extends IUserPostBody {
  location: {
    coordinates: [number, number]
    type: 'Point'
  }
  _id: string
}

export interface IUserResponse extends IUserModelParams {
  _id: string
}

export type TService = TCleaning | TGardening | TIroning

export interface ICoord {
  latitude: number
  longitude: number
}
