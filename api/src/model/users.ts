import { ObjectId } from 'mongodb'
import { IUserModelParams, IUserPatchBody, IUserResponse } from 'shared/types'
import { IUser } from '../types'
import { withUsersCollection } from './withCollection'

const documentToResponse = ({
  location: {
    coordinates: [longitude, latitude],
  },
  ...rest
}: any): IUserResponse => ({
  ...rest,
  coords: { latitude, longitude },
})

export const getUser = async (id: string): Promise<IUser | undefined> =>
  withUsersCollection(async collection => {
    const [result] = await collection.find(new ObjectId(id)).toArray()
    if (!result) return
    const { _id, ...rest } = result
    return { ...rest, id: _id.toString() }
  })

export const getUserByEmail = async (
  email: string,
): Promise<IUserResponse | undefined> =>
  withUsersCollection(async collection => {
    const [result] = await collection
      .find({ email: email.toLowerCase() })
      .toArray()

    return result ? documentToResponse(result) : result
  })

export const setUser = async ({
  coords,
  ...user
}: IUserModelParams): Promise<IUserResponse> =>
  withUsersCollection(async collection => {
    const document = {
      ...user,
      email: user.email.toLowerCase(),
      location: {
        coordinates: [coords.longitude, coords.latitude],
        type: 'Point',
      },
    }

    await collection.insertOne(document)

    return documentToResponse(document)
  })

// TODO: updating location
export const updateUser = async (
  id: string,
  updateObj: IUserPatchBody,
): Promise<void> =>
  withUsersCollection(async collection => {
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateObj })
  })
