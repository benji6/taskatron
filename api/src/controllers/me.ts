import { Request, Response } from 'express'
import { getUser } from '../model/user'
import pino from '../pino'

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
