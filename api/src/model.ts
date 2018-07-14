import { MongoClient, ObjectId } from 'mongodb'
import { IUserPostBody, IUserRecord } from './shared/types'

const url = 'mongodb://localhost:27017'
const dbName = 'taskatron'

export const insertUser = (user: IUserPostBody): Promise<IUserRecord> =>
  MongoClient.connect(url).then((client: any) =>
    client
      .db(dbName)
      .collection('users')
      .insertOne({
        ...user,
        email: user.email.toLowerCase(),
        signUpDate: new Date(),
      })
      .then((result: any) => {
        client.close()
        return user
      })
      .catch(() => client.close()),
  )

export const getUser = (id: string): Promise<IUserRecord> =>
  MongoClient.connect(url).then((client: any) =>
    client
      .db(dbName)
      .collection('users')
      .find(new ObjectId(id))
      .toArray()
      .then(
        ([result]: [IUserRecord]): IUserRecord => {
          client.close()
          return result
        },
      )
      .catch(() => client.close()),
  )

export const getUserByEmail = (
  email: string,
): Promise<IUserRecord | undefined> =>
  MongoClient.connect(url).then((client: any) =>
    client
      .db(dbName)
      .collection('users')
      .find({ email: email.toLowerCase() })
      .toArray()
      .then(
        ([result]: [IUserRecord | undefined]): IUserRecord | undefined => {
          client.close()
          return result
        },
      )
      .catch(() => client.close()),
  )
