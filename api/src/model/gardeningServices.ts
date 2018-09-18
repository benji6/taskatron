import { DeleteWriteOpResultObject, ObjectId, WriteOpResult } from 'mongodb'
import {
  IGardeningFilters,
  IGardeningSearchParams,
  IServiceGardeningDocument,
  IServiceGardeningModelParams,
} from '../shared/types'
import { GARDENING_SERVICES } from './collections'
import withDb from './withDb'

export const countGardeningServices = async (
  findParams: IGardeningFilters,
): Promise<number> =>
  withDb(db =>
    db
      .collection(GARDENING_SERVICES)
      .find(findParams)
      .count(),
  )

export const deleteGardeningService = async (
  id: string,
): Promise<DeleteWriteOpResultObject> =>
  withDb(async db =>
    db.collection(GARDENING_SERVICES).deleteOne({ _id: new ObjectId(id) }),
  )

export const getGardeningService = async (
  userId: string,
): Promise<IServiceGardeningDocument | undefined> =>
  withDb(async db => {
    const [result] = await db
      .collection(GARDENING_SERVICES)
      .find(new ObjectId(userId))
      .toArray()

    return result
  })

export const searchGardeningServices = async ({
  limit,
  skip,
  ...findParams
}: IGardeningSearchParams): Promise<IServiceGardeningDocument[]> =>
  withDb(db =>
    db
      .collection(GARDENING_SERVICES)
      .find(findParams)
      .skip(skip)
      .limit(limit)
      .toArray(),
  )

export const setGardeningService = async (
  service: IServiceGardeningModelParams,
): Promise<IServiceGardeningDocument> =>
  withDb(async db => {
    await db.collection(GARDENING_SERVICES).insertOne({
      ...service,
      userId: new ObjectId(service.userId),
    })

    return service as IServiceGardeningDocument
  })

export const updateGardeningService = async (
  document: IServiceGardeningDocument,
): Promise<WriteOpResult> =>
  withDb(async db =>
    db.collection(GARDENING_SERVICES).save({
      ...document,
      _id: new ObjectId((document as any)._id),
      userId: new ObjectId(document.userId),
    }),
  )
