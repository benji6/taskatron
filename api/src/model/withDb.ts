import { Db, MongoClient } from 'mongodb'

const url = 'mongodb://localhost:27017'
const dbName = 'taskatron'

export default async <A>(f: (a: Db) => A) => {
  const client = await MongoClient.connect(url)

  try {
    return f(client.db(dbName))
  } catch (e) {
    throw e
  } finally {
    client.close()
  }
}
