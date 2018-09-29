import { ObjectId } from 'mongodb'
import pino from '../pino'
import {
  IServiceDocument,
  IUserDocument,
  IUserModelParams,
  IUserPatchBody,
  IUserResponse,
} from '../shared/types'
import { SERVICES, USERS } from './collectionNames'
import withDb from './withDb'

withDb(db =>
  db
    .collection(USERS)
    .createIndex({ location: '2dsphere' })
    .then(str => pino.info(`${USERS} "2dsphere" index creation success:`, str))
    .catch(e => pino.error(`${USERS} "2dsphere" index creation failure:`, e)),
)

const documentToResponse = ({
  location: {
    coordinates: [longitude, latitude],
  },
  ...rest
}: IUserDocument): IUserResponse => ({
  ...rest,
  coords: { latitude, longitude },
})

export const getUser = async (id: string): Promise<IUserResponse | undefined> =>
  withDb(async db => {
    const [result] = await db
      .collection(USERS)
      .find(new ObjectId(id))
      .toArray()

    return result ? documentToResponse(result) : result
  })

export const getUserByEmail = async (
  email: string,
): Promise<IUserResponse | undefined> =>
  withDb(async db => {
    const [result] = await db
      .collection(USERS)
      .find({ email: email.toLowerCase() })
      .toArray()

    return result ? documentToResponse(result) : result
  })

export const getUserService = async (
  userId: string,
): Promise<IServiceDocument | undefined> =>
  withDb(async db => {
    const [result] = await db
      .collection(SERVICES)
      .find({ userId: new ObjectId(userId) })
      .toArray()

    return result
  })

export const setUser = async ({
  coords,
  ...user
}: IUserModelParams): Promise<IUserResponse> =>
  withDb(async db => {
    const document = {
      ...user,
      email: user.email.toLowerCase(),
      location: {
        coordinates: [coords.longitude, coords.latitude],
        type: 'Point',
      },
    }

    await db.collection(USERS).insertOne(document)

    return documentToResponse(document as IUserDocument)
  })

// TODO: updating location
export const updateUser = async (
  id: string,
  updateObj: IUserPatchBody,
): Promise<void> =>
  withDb(async db => {
    await db
      .collection(USERS)
      .updateOne({ _id: new ObjectId(id) }, { $set: updateObj })
  })
