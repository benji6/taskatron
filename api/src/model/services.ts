import { ObjectId, WriteOpResult } from 'mongodb'
import { CLEANING, GARDENING, IRONING } from '../shared/services'
import {
  IServiceCleaningRecord,
  IServiceGardeningRecord,
  IServiceIroningRecord,
  IServiceRecord,
} from '../shared/types'
import withDb from './withDb'

export const getCleaningService = async (
  userId: string,
): Promise<IServiceCleaningRecord | undefined> =>
  withDb(async db => {
    const results = await db
      .collection('services')
      .find({ service: CLEANING, userId: new ObjectId(userId) })
      .toArray()

    return results[0]
  })

export const getGardeningService = async (
  userId: string,
): Promise<IServiceCleaningRecord | undefined> =>
  withDb(async db => {
    const results = await db
      .collection('services')
      .find({ service: GARDENING, userId: new ObjectId(userId) })
      .toArray()

    return results[0]
  })

export const getIroningService = async (
  userId: string,
): Promise<IServiceCleaningRecord | undefined> =>
  withDb(async db => {
    const results = await db
      .collection('services')
      .find({ service: IRONING, userId: new ObjectId(userId) })
      .toArray()

    return results[0]
  })

export const getService = async (
  id: string,
): Promise<IServiceRecord | undefined> =>
  withDb(async db => {
    const results = await db
      .collection('services')
      .find(new ObjectId(id))
      .toArray()

    return results[0]
  })

export const getServices = async (userId: string): Promise<IServiceRecord[]> =>
  withDb(db =>
    db
      .collection('services')
      .find({ userId: new ObjectId(userId) })
      .toArray(),
  )

export const setService = async (
  document: IServiceRecord,
): Promise<WriteOpResult> =>
  withDb(async db =>
    db.collection('services').save({
      ...document,
      _id: new ObjectId((document as any)._id),
      userId: new ObjectId(document.userId),
    }),
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
