import { DeleteWriteOpResultObject, ObjectId, WriteOpResult } from 'mongodb'
import pino from '../pino'
import {
  IServiceDocument,
  IServiceFilters,
  IServiceModelParams,
  IServiceSearchParams,
} from '../shared/types'
import { SERVICES } from './collectionNames'
import withDb from './withDb'

withDb(db =>
  db
    .collection(SERVICES)
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
  withDb(db =>
    db
      .collection(SERVICES)
      .find(findParams)
      .count(),
  )

export const deleteService = async (
  id: string,
): Promise<DeleteWriteOpResultObject> =>
  withDb(async db =>
    db.collection(SERVICES).deleteOne({ _id: new ObjectId(id) }),
  )

export const getService = async (
  userId: string,
): Promise<IServiceDocument | undefined> =>
  withDb(async db => {
    const [result] = await db
      .collection(SERVICES)
      .find(new ObjectId(userId))
      .toArray()

    return result
  })

export const searchServices = async ({
  limit,
  skip,
  ...findParams
}: IServiceSearchParams): Promise<IServiceDocument[]> =>
  withDb(db =>
    db
      .collection(SERVICES)
      .find(findParams)
      .skip(skip)
      .limit(limit)
      .toArray(),
  )

export const setService = async (
  service: IServiceModelParams,
): Promise<IServiceDocument> =>
  withDb(async db => {
    await db.collection(SERVICES).insertOne({
      ...service,
      userId: new ObjectId(service.userId),
    })

    return service as IServiceDocument
  })

export const updateService = async (
  document: IServiceDocument,
): Promise<WriteOpResult> =>
  withDb(async db =>
    db.collection(SERVICES).save({
      ...document,
      _id: new ObjectId((document as any)._id),
      userId: new ObjectId(document.userId),
    }),
  )
