import {
  DeleteWriteOpResultObject,
  ObjectId,
  UpdateWriteOpResult,
} from 'mongodb'
import { IServiceFilters } from 'shared/types'
import pino from '../pino'
import { IService, IServiceCreateParams } from '../types'
import { SERVICES } from './collectionNames'
import { withServicesCollection } from './withCollection'

withServicesCollection(collection =>
  collection
    .createIndex({ location: '2dsphere' })
    .then(str =>
      pino.info(`${SERVICES} "2dsphere" index creation success:`, str),
    )
    .catch(e =>
      pino.error(`${SERVICES} "2dsphere" index creation failure:`, e),
    ),
)

export const addService = async ({
  userId,
  ...rest
}: IServiceCreateParams): Promise<IService> =>
  withServicesCollection(async collection => {
    const insertObj = {
      ...rest,
      userId: new ObjectId(userId),
    }
    await collection.insertOne(insertObj)
    return {
      ...rest,
      id: (insertObj as any)._id.toString(),
      userId,
    }
  })

export const countServices = async (
  findParams: IServiceFilters,
): Promise<number> =>
  withServicesCollection(collection => collection.find(findParams).count())

export const deleteService = async (
  id: string,
): Promise<DeleteWriteOpResultObject> =>
  withServicesCollection(collection =>
    collection.deleteOne({ _id: new ObjectId(id) }),
  )

export const getService = async (id: string): Promise<IService | undefined> =>
  withServicesCollection(async collection => {
    const [result] = await collection.find(new ObjectId(id)).toArray()
    if (!result) return
    const { _id, userId, ...rest } = result
    return { ...rest, id: _id.toString(), userId: userId.toString() }
  })

export const getServiceByUserId = async (
  userId: string,
): Promise<IService | undefined> =>
  withServicesCollection(async collection => {
    const [result] = await collection
      .find({ userId: new ObjectId(userId) })
      .toArray()
    if (!result) return
    const { _id, ...rest } = result
    return { ...rest, id: _id.toString(), userId }
  })

export const searchServices = async ({
  limit,
  skip,
  userId,
  ...findParams
}: any): Promise<IService[]> =>
  withServicesCollection(async collection => {
    const results = await collection
      .find({
        ...findParams,
        ...(userId ? { userId: new ObjectId(userId) } : {}),
      })
      .skip(skip)
      .limit(limit)
      .toArray()

    return results.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toString(),
      userId: rest.userId.toString(),
    }))
  })

export const updateService = async ({
  id,
  ...updatedFields
}: IService): Promise<UpdateWriteOpResult> =>
  withServicesCollection(async collection =>
    collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedFields }),
  )
