import { Request, Response } from 'express'
import {
  getIroningService,
  getService,
  setIroningService,
  setService,
} from '../../model/services'
import pino from '../../pino'
import { IRONING } from '../../shared/services'
import {
  IServiceIroningDocument,
  IServiceIroningPostBody,
} from '../../shared/types'
import {
  isBoolean,
  isDecimal,
  isService,
  isString,
} from '../../shared/validation'

interface IRequest extends Request {
  user: string
}

export const put = async (req: Request, res: Response) => {
  const body: IServiceIroningDocument = req.body
  const userId = (req as IRequest).user

  if (
    !isBoolean(body.bedLinen) ||
    !isBoolean(body.collectAndReturn) ||
    !isBoolean(body.hasOwnEquipment) ||
    !isBoolean(body.other) ||
    !isBoolean(body.shirts) ||
    !isBoolean(body.specialist) ||
    !isBoolean(body.trousers) ||
    !isDecimal(body.hourlyRate) ||
    !isService(body.service) ||
    !isString(body._id) ||
    body.userId !== userId
  ) {
    res.status(400).send('invalid request body')
    return
  }

  const document = await getService(body._id)

  try {
    if (!document) {
      res.status(400).send('document does not exist')
      return
    }

    await setService(body)

    res.status(200).send(body)
  } catch (e) {
    pino.error('PUT me/services/gardening', e)
    res.status(500).end()
  }
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
    pino.error('POST me/services/ironing', e)
    res.status(500).end()
  }
}
