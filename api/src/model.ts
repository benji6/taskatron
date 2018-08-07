import { Db, MongoClient, ObjectId } from 'mongodb'
import {
  IServiceCleaningRecord,
  IServiceGardeningRecord,
  IServiceIroningRecord,
  IServiceRecord,
  IUserPostBody,
  IUserRecord,
} from './shared/types'

const url = 'mongodb://localhost:27017'
const dbName = 'taskatron'

const withDb = async <A>(f: (a: Db) => A) => {
  const client = await MongoClient.connect(url)

  try {
    return f(client.db(dbName))
  } catch (e) {
    throw e
  } finally {
    client.close()
  }
}

export const setCleaningService = async (
  service: IServiceCleaningRecord,
): Promise<IServiceCleaningRecord> =>
  withDb(async db => {
    await db.collection('services').insertOne({
      ...service,
      creationDate: new Date(),
    })

    return service
  })

export const setGardeningService = async (
  service: IServiceGardeningRecord,
): Promise<IServiceGardeningRecord> =>
  withDb(async db => {
    await db.collection('services').insertOne({
      ...service,
      creationDate: new Date(),
    })

    return service
  })

export const setIroningService = async (
  service: IServiceIroningRecord,
): Promise<IServiceIroningRecord> =>
  withDb(async db => {
    await db.collection('services').insertOne({
      ...service,
      creationDate: new Date(),
    })

    return service
  })

export const setUser = async (user: IUserPostBody): Promise<any> =>
  withDb(async db => {
    await db.collection('users').insertOne({
      ...user,
      email: user.email.toLowerCase(),
      signUpDate: new Date(),
    })

    return user
  })

export const getServices = async (userId: string): Promise<IServiceRecord[]> =>
  withDb(async db =>
    db
      .collection('services')
      .find({ userId })
      .toArray(),
  )

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
