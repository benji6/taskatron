import { Request, Response } from 'express'
import { getServices } from '../../model'
import pino from '../../pino'

interface IRequest extends Request {
  user: string
}

export const get = async (req: Request, res: Response) => {
  try {
    const serviceRecord = await getServices((req as IRequest).user)
    res.status(200).send(serviceRecord)
  } catch (e) {
    pino.error('GET /services error', e)
    res.status(500).end()
  }
}
