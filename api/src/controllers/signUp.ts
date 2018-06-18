import { Request, Response } from 'express'
import pino from '../pino'

export const post = (req: Request, res: Response) => {
  pino.info(req.body)
  res.status(204).end()
}
