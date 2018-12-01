import {
  DeleteWriteOpResultObject,
  ObjectId,
  UpdateWriteOpResult,
} from 'mongodb'
import {
  IServiceDocument,
  IServiceFilters,
  IServiceModelParams,
} from 'shared/types'
import pino from '../pino'
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

export const addService = async (
  service: IServiceModelParams,
): Promise<IServiceDocument> =>
  withServicesCollection(async collection => {
    const insertObj = {
      ...service,
      userId: new ObjectId(service.userId),
    }

    await collection.insertOne(insertObj)

    return { ...service, _id: (insertObj as any)._id }
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

export const getService = async (
  id: string,
): Promise<IServiceDocument | undefined> =>
  withServicesCollection(async collection => {
    const [result] = await collection.find(new ObjectId(id)).toArray()

    return result
  })

export const getServiceByUserId = async (
  userId: string,
): Promise<IServiceDocument | undefined> =>
  withServicesCollection(async collection => {
    const [result] = await collection
      .find({ userId: new ObjectId(userId) })
      .toArray()

    return result
  })

export const searchServices = async ({
  limit,
  skip,
  userId,
  ...findParams
}: any): Promise<IServiceDocument[]> => {
  return withServicesCollection(collection =>
    collection
      .find({
        ...findParams,
        ...(userId ? { userId: new ObjectId(userId) } : {}),
      })
      .skip(skip)
      .limit(limit)
      .toArray(),
  )
}

export const updateService = async ({
  _id,
  ...updatedFields
}: IServiceDocument): Promise<UpdateWriteOpResult> =>
  withServicesCollection(async collection =>
    collection.updateOne({ _id: new ObjectId(_id) }, { $set: updatedFields }),
  )
