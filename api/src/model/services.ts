import { ObjectId, WriteOpResult } from 'mongodb'
import { CLEANING, GARDENING, IRONING } from '../shared/services'
import {
  IServiceCleaningDocument,
  IServiceDocument,
  IServiceGardeningDocument,
  IServiceIroningDocument,
} from '../shared/types'
import withDb from './withDb'

export const getCleaningService = async (
  userId: string,
): Promise<IServiceCleaningDocument | undefined> =>
  withDb(async db => {
    const results = await db
      .collection('services')
      .find({ service: CLEANING, userId: new ObjectId(userId) })
      .toArray()

    return results[0]
  })

export const getGardeningService = async (
  userId: string,
): Promise<IServiceCleaningDocument | undefined> =>
  withDb(async db => {
    const results = await db
      .collection('services')
      .find({ service: GARDENING, userId: new ObjectId(userId) })
      .toArray()

    return results[0]
  })

export const getIroningService = async (
  userId: string,
): Promise<IServiceCleaningDocument | undefined> =>
  withDb(async db => {
    const results = await db
      .collection('services')
      .find({ service: IRONING, userId: new ObjectId(userId) })
      .toArray()

    return results[0]
  })

export const getService = async (
  id: string,
): Promise<IServiceDocument | undefined> =>
  withDb(async db => {
    const results = await db
      .collection('services')
      .find(new ObjectId(id))
      .toArray()

    return results[0]
  })

export const getServices = async (
  userId: string,
): Promise<IServiceDocument[]> =>
  withDb(db =>
    db
      .collection('services')
      .find({ userId: new ObjectId(userId) })
      .toArray(),
  )

export const setService = async (
  document: IServiceDocument,
): Promise<WriteOpResult> =>
  withDb(async db =>
    db.collection('services').save({
      ...document,
      _id: new ObjectId((document as any)._id),
      userId: new ObjectId(document.userId),
    }),
  )

export const setCleaningService = async (
  service: IServiceCleaningDocument,
): Promise<IServiceCleaningDocument> =>
  withDb(async db => {
    await db.collection('services').insertOne({
      ...service,
      userId: new ObjectId(service.userId),
    })

    return service
  })

export const setGardeningService = async (
  service: IServiceGardeningDocument,
): Promise<IServiceGardeningDocument> =>
  withDb(async db => {
    await db.collection('services').insertOne({
      ...service,
      userId: new ObjectId(service.userId),
    })

    return service
  })

export const setIroningService = async (
  service: IServiceIroningDocument,
): Promise<IServiceIroningDocument> =>
  withDb(async db => {
    await db.collection('services').insertOne({
      ...service,
      userId: new ObjectId(service.userId),
    })

    return service
  })
