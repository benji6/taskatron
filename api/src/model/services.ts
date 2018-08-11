import { ObjectId } from 'mongodb'
import {
  IServiceCleaningRecord,
  IServiceGardeningRecord,
  IServiceIroningRecord,
  IServiceRecord,
} from '../shared/types'
import withDb from './withDb'

export const getServices = async (userId: string): Promise<IServiceRecord[]> =>
  withDb(async db =>
    db
      .collection('services')
      .find({ userId })
      .toArray(),
  )

export const setCleaningService = async (
  service: IServiceCleaningRecord,
): Promise<IServiceCleaningRecord> =>
  withDb(async db => {
    await db.collection('services').insertOne({
      ...service,
      userId: new ObjectId(service.userId),
    })

    return service
  })

export const setGardeningService = async (
  service: IServiceGardeningRecord,
): Promise<IServiceGardeningRecord> =>
  withDb(async db => {
    await db.collection('services').insertOne({
      ...service,
      userId: new ObjectId(service.userId),
    })

    return service
  })

export const setIroningService = async (
  service: IServiceIroningRecord,
): Promise<IServiceIroningRecord> =>
  withDb(async db => {
    await db.collection('services').insertOne({
      ...service,
      userId: new ObjectId(service.userId),
    })

    return service
  })
