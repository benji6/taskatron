import { DeleteWriteOpResultObject, ObjectId, WriteOpResult } from 'mongodb'
import pino from '../pino'
import {
  IServiceDocument,
  IServiceFilters,
  IServiceModelParams,
  IServiceSearchParams,
} from '../shared/types'
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
  userId: string,
): Promise<IServiceDocument | undefined> =>
  withServicesCollection(async collection => {
    const [result] = await collection.find(new ObjectId(userId)).toArray()

    return result
  })

export const searchServices = async ({
  limit,
  skip,
  ...findParams
}: IServiceSearchParams): Promise<IServiceDocument[]> =>
  withServicesCollection(collection =>
    collection
      .find(findParams)
      .skip(skip)
      .limit(limit)
      .toArray(),
  )

export const setService = async (
  service: IServiceModelParams,
): Promise<IServiceDocument> =>
  withServicesCollection(async collection => {
    await collection.insertOne({
      ...service,
      userId: new ObjectId(service.userId),
    })

    return service as IServiceDocument
  })

export const updateService = async (
  document: IServiceDocument,
): Promise<WriteOpResult> =>
  withServicesCollection(async collection =>
    collection.save({
      ...document,
      _id: new ObjectId((document as any)._id),
      userId: new ObjectId(document.userId),
    }),
  )
