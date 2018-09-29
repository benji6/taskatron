import { ObjectId } from 'mongodb'
import { SERVICES } from '../model/collectionNames'
import { setUser } from '../model/user'
import withDb from '../model/withDb'
import { IServiceModelParams } from '../shared/types'

const numberOfServices = 1024

const randomBoolean = (): boolean => !Math.round(Math.random())
const randomHourlyRate = (): number =>
  Number((5 + Math.random() * 20).toFixed(2))

const main = async () => {
  const user = await setUser({
    email: 'fake@email.com',
    firstName: 'Ash',
    isTestData: true,
    lastName: 'Ketchum',
    postcode: 'SW1A 1AA',
    radius: 10,
  } as any)

  const cleaningServices: IServiceModelParams[] = [
    ...Array(numberOfServices).keys(),
  ].map(() => ({
    carpetClean: randomBoolean(),
    deepClean: randomBoolean(),
    general: randomBoolean(),
    hasOwnEquipment: randomBoolean(),
    hasOwnProducts: randomBoolean(),
    hourlyRate: randomHourlyRate(),
    isTestData: true,
    ovenClean: randomBoolean(),
    userId: user._id,
  }))

  withDb(db =>
    db.collection(SERVICES).insertMany(
      cleaningServices.map(service => ({
        ...service,
        userId: new ObjectId(service.userId),
      })),
    ),
  )
}

main()
