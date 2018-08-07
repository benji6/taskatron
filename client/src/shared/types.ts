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

export interface IServiceGardeningRecord extends IServiceGardeningPostBody {
  _id: string
  service: 'gardening'
  userId: string
}

export type IServiceRecord =
  | IServiceCleaningRecord
  | IServiceGardeningRecord
  | IServiceIroningRecord

export interface IServiceCleaningRecord extends IServiceCleaningPostBody {
  _id: string
  service: 'cleaning'
  userId: string
}

export interface IServiceIroningRecord extends IServiceIroningPostBody {
  _id: string
  service: 'ironing'
  userId: string
}

export interface IUserPostBody {
  email: string
  firstName: string
  lastName: string
  postcode: string
}

export interface IUserRecord extends IUserPostBody {
  _id: string
}
