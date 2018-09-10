import { setCleaningService } from '../model/cleaningServices'
import { setUser } from '../model/user'
import { IServiceCleaningModelParams } from '../shared/types'

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

  const cleaningServices: IServiceCleaningModelParams[] = [
    ...Array(16).keys(),
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

  cleaningServices.forEach(setCleaningService)
}

main()
