import { CLEANING_SERVICES, USERS } from '../model/collections'
import withDb from '../model/withDb'

withDb(db => {
  db.collection(CLEANING_SERVICES).deleteMany({ isTestData: true })
  db.collection(USERS).deleteMany({ isTestData: true })
})
