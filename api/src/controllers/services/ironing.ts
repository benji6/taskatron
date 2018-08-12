import { Request, Response } from 'express'
import { getIroningService, setIroningService } from '../../model/services'
import pino from '../../pino'
import { IRONING } from '../../shared/services'
import { IServiceIroningPostBody } from '../../shared/types'
import { isBoolean, isDecimal } from '../../shared/validation'

interface IRequest extends Request {
  user: string
}

export const post = async (req: Request, res: Response) => {
  const body: IServiceIroningPostBody = req.body
  const userId = (req as IRequest).user

  if (
    !isBoolean(body.bedLinen) ||
    !isBoolean(body.collectAndReturn) ||
    !isBoolean(body.hasOwnEquipment) ||
    !isBoolean(body.other) ||
    !isBoolean(body.shirts) ||
    !isBoolean(body.specialist) ||
    !isBoolean(body.trousers) ||
    !isDecimal(body.hourlyRate)
  ) {
    res.status(400).send('invalid request body')
    return
  }

  try {
    if (await getIroningService(userId)) {
      res.status(400).send('document already exists')
      return
    }

    const serviceDocument = await setIroningService({
      ...body,
      service: IRONING,
      userId,
    })

    res.status(200).send(serviceDocument)
  } catch (e) {
    pino.error('services/ironing post fail', e)
    res.status(500).end()
  }
}
