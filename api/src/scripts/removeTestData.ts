import { SERVICES, USERS } from '../model/collectionNames'
import withDb from '../model/withDb'

withDb(db => {
  db.collection(SERVICES).deleteMany({ isTestData: true })
  db.collection(USERS).deleteMany({ isTestData: true })
})
