import { Request, Response } from 'express';

interface IRequest extends Request {
  user: string
}

export const get = (req: IRequest, res: Response): void => {
  res.status(200).send('user: ' + JSON.stringify(req.user))
}
