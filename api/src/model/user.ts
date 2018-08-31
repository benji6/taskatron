import { ObjectId } from 'mongodb'
import { IUserDocument, IUserPatchBody, IUserPostBody } from '../shared/types'
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

export const setUser = async (user: IUserPostBody): Promise<any> =>
  withDb(async db => {
    await db.collection('users').insertOne({
      ...user,
      email: user.email.toLowerCase(),
    })

    return user
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
