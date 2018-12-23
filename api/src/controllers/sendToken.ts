import { Request, Response } from 'express'

export const post = (req: Request, res: Response): void => {
  res.status(201).end()
}
