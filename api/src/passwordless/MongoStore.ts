import * as bcrypt from 'bcrypt'
import { Collection } from 'mongodb'
import { PASSWORDLESS_TOKENS } from '../model/collectionNames'
import withDb from '../model/withDb'

export default class MongoStore {
  public authenticate(token: string, uid: string, callback: any) {
    this.getCollection((collection: Collection) => {
      collection.findOne(
        { uid, ttl: { $gt: new Date() } },
        (error: Error | undefined, item) => {
          if (error) {
            callback(error, false, null)
          } else if (item) {
            bcrypt.compare(
              token,
              item.hashedToken,
              (err: Error | undefined, res) => {
                if (err) {
                  callback(err, false, null)
                } else if (res) {
                  callback(null, true, item.originUrl || '')
                } else {
                  callback(null, false, null)
                }
              },
            )
          } else {
            callback(null, false, null)
          }
        },
      )
    })
  }

  public storeOrUpdate(
    token: string,
    uid: string,
    msToLive: number,
    originUrl: string,
    callback: any,
  ) {
    this.getCollection((collection: Collection) => {
      bcrypt.hash(
        token,
        10,
        (error: Error | undefined, hashedToken: string) => {
          if (error) return callback(error)

          const newRecord = {
            hashedToken,
            originUrl,
            ttl: new Date(Date.now() + msToLive),
            uid,
          }

          collection
            .update({ uid }, newRecord, { upsert: true })
            .then(() => callback(), callback)
        },
      )
    })
  }

  public invalidateUser(uid: string, callback: any) {
    this.getCollection((collection: Collection) => {
      collection.remove({ uid }, { w: 1 }, (err?: Error) => {
        if (err) callback(err)
        else callback()
      })
    })
  }

  public clear(callback: (e?: Error) => void) {
    this.getCollection((collection: Collection) => {
      collection.remove({}, { w: 1 }, (err?: Error) => {
        if (err) callback(err)
        else callback()
      })
    })
  }

  public length(callback: any) {
    this.getCollection((collection: Collection) => collection.count(callback))
  }

  private getCollection(callback: (a: Collection) => void) {
    withDb(async db => {
      const collection = db.collection(PASSWORDLESS_TOKENS)

      await collection.createIndex({ uid: 1 }, { unique: true })
      await collection.createIndex({ ttl: 1 }, { expireAfterSeconds: 0 })

      callback(collection)
    })
  }
}
