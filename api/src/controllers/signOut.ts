import { Request, Response } from 'express'

export const get = (req: Request, res: Response) => {
  res.status(204).end()
}
