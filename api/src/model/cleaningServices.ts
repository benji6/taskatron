import { DeleteWriteOpResultObject, ObjectId, WriteOpResult } from 'mongodb'
import {
  ICleaningFilters,
  ICleaningSearchParams,
  IServiceCleaningDocument,
  IServiceCleaningModelParams,
} from '../shared/types'
import { CLEANING_SERVICES } from './collections'
import withDb from './withDb'

export const countCleaningServices = async (
  findParams: ICleaningFilters,
): Promise<number> =>
  withDb(db =>
    db
      .collection(CLEANING_SERVICES)
      .find(findParams)
      .count(),
  )

export const deleteCleaningService = async (
  id: string,
): Promise<DeleteWriteOpResultObject> =>
  withDb(async db =>
    db.collection(CLEANING_SERVICES).deleteOne({ _id: new ObjectId(id) }),
  )

export const getCleaningService = async (
  userId: string,
): Promise<IServiceCleaningDocument | undefined> =>
  withDb(async db => {
    const [result] = await db
      .collection(CLEANING_SERVICES)
      .find(new ObjectId(userId))
      .toArray()

    return result
  })

export const searchCleaningServices = async ({
  limit,
  skip,
  ...findParams
}: ICleaningSearchParams): Promise<IServiceCleaningDocument[]> =>
  withDb(db =>
    db
      .collection(CLEANING_SERVICES)
      .find(findParams)
      .skip(skip)
      .limit(limit)
      .toArray(),
  )

export const setCleaningService = async (
  service: IServiceCleaningModelParams,
): Promise<IServiceCleaningDocument> =>
  withDb(async db => {
    await db.collection(CLEANING_SERVICES).insertOne({
      ...service,
      userId: new ObjectId(service.userId),
    })

    return service as IServiceCleaningDocument
  })

export const updateCleaningService = async (
  document: IServiceCleaningDocument,
): Promise<WriteOpResult> =>
  withDb(async db =>
    db.collection(CLEANING_SERVICES).save({
      ...document,
      _id: new ObjectId((document as any)._id),
      userId: new ObjectId(document.userId),
    }),
  )
