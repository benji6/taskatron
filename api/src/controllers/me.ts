import { Request, Response } from 'express'
import { getUser, updateUser } from '../model/user'
import pino from '../pino'
import { IUserPatchBody } from '../shared/types'
import {
  isRadius,
  isValidFirstName,
  isValidLastName,
  isValidPostcode,
} from '../shared/validation'

interface IRequest extends Request {
  user: string
}

export const get = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await getUser((req as IRequest).user)

    if (!user) return res.status(404).end()

    res.status(200).send(user)
  } catch (e) {
    res.status(500).end()
    pino.error(e)
  }
}

export const patch = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as IRequest).user
  const body: IUserPatchBody = req.body
  const { firstName, lastName, postcode, radius } = body

  if (
    !isRadius(radius) ||
    !isValidFirstName(firstName) ||
    !isValidLastName(lastName) ||
    !isValidPostcode(postcode) ||
    Object.keys(body).length !== 4
  ) {
    return res.status(400).end()
  }

  try {
    const user = await getUser(userId)

    if (!user) return res.status(404).end()

    await updateUser(userId, body)

    res.status(204).end()
  } catch (e) {
    res.status(500).end()
    pino.error(e)
  }
}
