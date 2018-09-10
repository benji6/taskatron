import { DeleteWriteOpResultObject, ObjectId, WriteOpResult } from 'mongodb'
import {
  IServiceIroningDocument,
  IServiceIroningModelParams,
} from '../shared/types'
import { IRONING_SERVICES } from './collections'
import withDb from './withDb'

export const countIroningServices = async (): Promise<number> =>
  withDb(db =>
    db
      .collection(IRONING_SERVICES)
      .find()
      .count(),
  )

export const deleteIroningService = async (
  id: string,
): Promise<DeleteWriteOpResultObject> =>
  withDb(async db =>
    db.collection(IRONING_SERVICES).deleteOne({ _id: new ObjectId(id) }),
  )

export const getIroningService = async (
  userId: string,
): Promise<IServiceIroningDocument | undefined> =>
  withDb(async db => {
    const [result] = await db
      .collection(IRONING_SERVICES)
      .find(new ObjectId(userId))
      .toArray()

    return result
  })

export const searchIroningServices = async ({
  limit,
  skip,
}: {
  limit: number
  skip: number
}): Promise<IServiceIroningDocument[]> =>
  withDb(db =>
    db
      .collection(IRONING_SERVICES)
      .find()
      .skip(skip)
      .limit(limit)
      .toArray(),
  )

export const setIroningService = async (
  service: IServiceIroningModelParams,
): Promise<IServiceIroningDocument> =>
  withDb(async db => {
    await db.collection(IRONING_SERVICES).insertOne({
      ...service,
      userId: new ObjectId(service.userId),
    })

    return service as IServiceIroningDocument
  })

export const updateIroningService = async (
  document: IServiceIroningDocument,
): Promise<WriteOpResult> =>
  withDb(async db =>
    db.collection(IRONING_SERVICES).save({
      ...document,
      _id: new ObjectId((document as any)._id),
      userId: new ObjectId(document.userId),
    }),
  )
