import { ObjectId } from 'mongodb'
import { IUserPostBody, IUserRecord } from '../shared/types'
import withDb from './withDb'

export const setUser = async (user: IUserPostBody): Promise<any> =>
  withDb(async db => {
    await db.collection('users').insertOne({
      ...user,
      email: user.email.toLowerCase(),
      signUpDate: new Date(),
    })

    return user
  })

export const getUser = async (id: string): Promise<IUserRecord> =>
  withDb(async db => {
    const results = await db
      .collection('users')
      .find(new ObjectId(id))
      .toArray()

    return results[0]
  })

export const getUserByEmail = async (
  email: string,
): Promise<IUserRecord | undefined> =>
  withDb(async db => {
    const results = await db
      .collection('users')
      .find({ email: email.toLowerCase() })
      .toArray()

    return results[0]
  })
