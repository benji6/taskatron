import { Request, Response } from 'express'
import { getUser, updateUser } from '../model/user'
import pino from '../pino'
import {
  isFirstName,
  isLastName,
  isPostcode,
  IUserPatchBody,
} from '../shared/types'

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
  const { firstName, lastName, postcode } = body

  if (
    !isFirstName(firstName) ||
    !isLastName(lastName) ||
    !isPostcode(postcode) ||
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
