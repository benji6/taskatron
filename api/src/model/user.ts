import { ObjectId } from 'mongodb'
import {
  IServiceDocument,
  IUserDocument,
  IUserPatchBody,
  IUserPostBody,
} from '../shared/types'
import {
  collectionNameToServiceType,
  serviceCollectionNames,
} from './collections'
import withDb from './withDb'

export const getUser = async (id: string): Promise<IUserDocument | undefined> =>
  withDb(async db => {
    const results = await db
      .collection('users')
      .find(new ObjectId(id))
      .toArray()

    return results[0]
  })

export const getUserByEmail = async (
  email: string,
): Promise<IUserDocument | undefined> =>
  withDb(async db => {
    const results = await db
      .collection('users')
      .find({ email: email.toLowerCase() })
      .toArray()

    return results[0]
  })

export const getUserServices = async (
  userId: string,
): Promise<IServiceDocument[]> =>
  withDb(async db => {
    const services = await Promise.all(
      serviceCollectionNames.map(async collectionName => {
        const [result] = await db
          .collection(collectionName)
          .find({ userId: new ObjectId(userId) })
          .toArray()

        return result
          ? {
              ...result,
              serviceType: collectionNameToServiceType[collectionName],
            }
          : result
      }),
    )
    return services.filter(Boolean)
  })

export const setUser = async (user: IUserPostBody): Promise<IUserDocument> =>
  withDb(async db => {
    const document = {
      ...user,
      email: user.email.toLowerCase(),
    }

    await db.collection('users').insertOne(document)

    return document as IUserDocument
  })

export const updateUser = async (
  id: string,
  updateObj: IUserPatchBody,
): Promise<void> =>
  withDb(async db => {
    await db
      .collection('users')
      .updateOne({ _id: new ObjectId(id) }, { $set: updateObj })
  })
