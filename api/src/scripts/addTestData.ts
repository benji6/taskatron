import { ObjectId } from 'mongodb'
import { ILocation, IServiceModelParams } from 'shared/types'
import { setUser } from '../model/user'
import { withServicesCollection } from '../model/withCollection'

let i = 0
const numberOfServices = 1024

const randomBoolean = (): boolean => !Math.round(Math.random())
const randomHourlyRate = (): number =>
  Number((5 + Math.random() * 20).toFixed(2))

const main = async () => {
  const location: ILocation = {
    coordinates: [0, 50],
    type: 'Point',
  }

  const user = await setUser({
    coords: { latitude: 50, longitude: 0 },
    email: 'fake@email.com',
    firstName: 'Ash',
    isTestData: true,
    lastName: 'Ketchum',
    postcode: 'SW1A 1AA',
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
    location,
    name: `Test cleaning service ${i++}`,
    ovenClean: randomBoolean(),
    radius: 10,
    userId: user._id,
  }))

  withServicesCollection(collection =>
    collection.insertMany(
      cleaningServices.map(service => ({
        ...service,
        userId: new ObjectId(service.userId),
      })),
    ),
  )
}

main()
