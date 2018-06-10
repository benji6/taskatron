import { Request, Response } from 'express';
import {getUser} from '../model'
import { IUserRecord } from '../shared/types';
import pino from '../pino';

interface IRequest extends Request {
  user: string
}

export const get = (req: IRequest, res: Response): void => {
  getUser(req.user)
    .then((user: IUserRecord) => {
      res.status(200).send(user)
    })
    .catch((err: Error) => {
      res.status(500).end()
      pino.error(err);
    })
}
