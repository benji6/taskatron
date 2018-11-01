import * as bcrypt from 'bcrypt'
import { Collection } from 'mongodb'
import { withPasswordlessTokensCollection } from '../model/withCollection'

export default class MongoStore {
  public authenticate(token: string, uid: string, callback: any) {
    this.getCollection((collection: Collection) => {
      collection.findOne(
        { uid, ttl: { $gt: new Date() } },
        (error: Error | undefined, item) => {
          if (error) {
            callback(error, false)
          } else if (item) {
            bcrypt.compare(
              token,
              item.hashedToken,
              (err: Error | undefined, res) => {
                if (err) {
                  callback(err, false)
                } else if (res) {
                  callback(null, true)
                } else {
                  callback(null, false)
                }
              },
            )
          } else {
            callback(null, false)
          }
        },
      )
    })
  }

  public storeOrUpdate(
    token: string,
    uid: string,
    msToLive: number,
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
    withPasswordlessTokensCollection(async collection => {
      await collection.createIndex({ uid: 1 }, { unique: true })
      await collection.createIndex({ ttl: 1 }, { expireAfterSeconds: 0 })

      callback(collection)
    })
  }
}
