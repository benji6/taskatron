import * as t from 'io-ts'
import { radii } from './constants'

const postCodeRegex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})/

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
const isRadius = (a: any): a is number =>
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

const servicePostBodyObj = {
  carpetClean: t.boolean,
  deepClean: t.boolean,
  general: t.boolean,
  hasOwnEquipment: t.boolean,
  hasOwnProducts: t.boolean,
  hourlyRate: decimal,
  ovenClean: t.boolean,
  radius,
}

export const ServicePostBody = t.exact(t.type(servicePostBodyObj))

export type IServicePostBody = t.TypeOf<typeof ServicePostBody>

export const ServiceDocument = t.exact(
  t.type({
    ...servicePostBodyObj,
    _id: t.string,
    userId: t.string,
  }),
)

export const ServiceFilters = t.partial({
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

export interface ILocation {
  coordinates: [number, number]
  type: 'Point'
}

export type IServiceFilters = t.TypeOf<typeof ServiceFilters>

export const ServiceSearchParams = t.exact(
  t.intersection([
    ServiceFilters,
    t.type({
      limit: t.number,
      skip: t.number,
    }),
  ]),
)

export type IServiceSearchParams = t.TypeOf<typeof ServiceSearchParams>

export interface IServiceModelParams extends IServicePostBody {
  location: ILocation
  userId: string
}

export interface IServiceDocument extends IServiceModelParams {
  _id: string
}

export interface IServiceResponseObject extends IServiceDocument {
  providerName: string
}

export interface IServiceSearchResponse {
  results: IServiceResponseObject[]
  total: number
}

export interface IUserPatchBody {
  firstName: string
  lastName: string
  postcode: string
}

export const UserPostBody = t.exact(
  t.type({
    email,
    firstName,
    lastName,
    postcode,
  }),
)

export type IUserPostBody = t.TypeOf<typeof UserPostBody>

export interface IUserModelParams extends IUserPostBody {
  coords: ICoord
}

export interface IUserDocument extends IUserPostBody {
  _id: string
  location: ILocation
}

export interface IUserResponse extends IUserModelParams {
  _id: string
}

export interface ICoord {
  latitude: number
  longitude: number
}
