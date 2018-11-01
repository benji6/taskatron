import {
  withServicesCollection,
  withUsersCollection,
} from '../model/withCollection'

withServicesCollection(collection =>
  collection.deleteMany({ isTestData: true }),
)
withUsersCollection(collection => collection.deleteMany({ isTestData: true }))
