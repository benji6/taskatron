import { Collection, MongoClient } from 'mongodb'
import * as collectionNames from './collectionNames'

const { PASSWORDLESS_TOKENS, SERVICES, USERS } = collectionNames

const url = 'mongodb://localhost:27017'
const dbName = 'taskatron'

const withCollection = (
  collectionName: collectionNames.TCollectionNames,
) => async <A>(f: (a: Collection) => A) => {
  const client = await MongoClient.connect(url)

  try {
    return f(client.db(dbName).collection(collectionName))
  } catch (e) {
    throw e
  } finally {
    setTimeout(() => client.close(), 3000) // TODO - fix hack
  }
}

export const withServicesCollection = withCollection(SERVICES)
export const withUsersCollection = withCollection(USERS)
export const withPasswordlessTokensCollection = withCollection(
  PASSWORDLESS_TOKENS,
)
